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
import java.util.*;

@WebServlet("/tasks")
public class TasksServlet extends HttpServlet {
    private final Gson gson = new Gson();
    List<String> tasks = new ArrayList<>(Arrays.asList("task1", "task2", "task3"));

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();
        Map<String, Map<Integer, String>> tasksData = new HashMap<>(1);
        Map<Integer, String> tasksMap = new HashMap<>();

        for (int i = 0; i < tasks.size(); i++) {
            tasksMap.put(i + 1, tasks.get(i));
        }
        tasksData.put("tasks", tasksMap);


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

        String method = (String) data.get("action");
        String text = (String) data.get("text");

        String idTask = new String();
        if (method.equals("addTask")) {
            tasks.add(text);
            idTask = String.valueOf(tasks.size());
        } else if (method.equals("deleteTask")) {
            idTask = String.valueOf(tasks.indexOf(text)+1);
            tasks.remove(text);
        }else{
            System.err.println("err");
        }

        Map<String, Object> responseData = new HashMap<>();

        responseData.put("status", "success");
        responseData.put("idTask", idTask);
        responseData.put("Text", text);
        System.err.println(responseData.get("idTask"));

        String jsonResponse = gson.toJson(responseData);
        response.getWriter().write(jsonResponse);

    }


//    @Override
//    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//
//         Map<String, Object> data = gson.fromJson(request.getReader(), Map.class);
//
//         String text = (String) data.get("text");
//         tasks.remove(text);
//         Map<String, Object> responseData = new HashMap<>();
//        responseData.put("status", "success");
//        responseData.put("deleteText", text);
//        String jsonResponse = gson.toJson(responseData);
//        response.getWriter().write(jsonResponse);
//    }
}
