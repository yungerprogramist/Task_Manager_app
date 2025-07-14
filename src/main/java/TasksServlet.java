import com.google.gson.Gson;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Inet4Address;
import java.util.*;

@WebServlet("/tasks")
public class TasksServlet extends HttpServlet {
    private final Gson gson = new Gson();
    Map<Integer, String> tasksDB = new HashMap<>();
    int currentId = 0;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();
        Map<String, Map<Integer, String>> tasksData = new HashMap<>(1);
        tasksData.put("tasks", tasksDB);

        PrintWriter writer = response.getWriter();
        String gsonFile = gson.toJson(tasksData);
        writer.print(gsonFile);
        writer.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> data = gson.fromJson(request.getReader(), Map.class);
        String text = (String) data.get("text");

        tasksDB.put(++currentId, text);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("status", "success");
        responseData.put("idTask", currentId);
        responseData.put("Text", text);


        String jsonResponse = gson.toJson(responseData);
        response.getWriter().write(jsonResponse);

    }


    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Map<String, Object> responseData = new HashMap<>();

        Map<String, Object> data = gson.fromJson(request.getReader(), Map.class);
        Number idNumber = (Number) data.get("id");
        int idTask = idNumber.intValue();
        String newText = (String) data.get("text");

        tasksDB.put(idTask, newText);
        responseData.put("status", "success");
        String jsonResponse = gson.toJson(responseData);
        response.getWriter().write(jsonResponse);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Map<String, Object> responseData = new HashMap<>();

        Map<String, Object> data = gson.fromJson(request.getReader(), Map.class);
        Number idNumber = (Number) data.get("id");
        int idTask = idNumber.intValue();

        if (!tasksDB.containsKey(idTask)){
            responseData.put("status", "error");
            responseData.put("info", "id is not exist (id = NULL)");
            String jsonResponse = gson.toJson(responseData);
            response.getWriter().write(jsonResponse);
            return;
        }
        tasksDB.remove(idTask);


        responseData.put("status", "success");
        responseData.put("idTask", idTask);
        responseData.put("deleteText", tasksDB.get(idTask));

        String jsonResponse = gson.toJson(responseData);
        response.getWriter().write(jsonResponse);
    }
}
