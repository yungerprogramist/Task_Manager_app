import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/tasks")
public class TasksServlet extends HttpServlet {
    private final Gson gson = new Gson();
    private final Map<Integer, String> tasksDB = new HashMap<>();
    private int currentId = 0;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        configureResponse(response);
        Map<String, Map<Integer, String>> tasksData = new HashMap<>(1);

        String searchText = request.getParameter("search-text");

        if (searchText==null) {
            tasksData.put("tasks", tasksDB);
        } else{
            Map<Integer, String> searchTasks = new HashMap<>();

            for (Map.Entry<Integer, String> entry : tasksDB.entrySet()) {
                Integer key = entry.getKey();
                String value = entry.getValue();
                if (value.contains(searchText)){
                    searchTasks.put(key, value);
                }
            }

            tasksData.put("tasks", searchTasks);
        }

        PrintWriter writer = response.getWriter();
        String gsonFile = gson.toJson(tasksData);
        writer.print(gsonFile);
        writer.flush();
    }

    private static void configureResponse(HttpServletResponse response) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        configureResponse(response);

        Map<String, Object> data = gson.fromJson(request.getReader(), Map.class);
        String text = (String) data.get("text");

        tasksDB.put(++currentId, text);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("status", "success");
        responseData.put("idTask", currentId);
        responseData.put("Text", text);


        writeResponse(response, responseData);

    }


    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        configureResponse(response);
        Map<String, Object> responseData = new HashMap<>();

        Map<String, Object> data = gson.fromJson(request.getReader(), Map.class);
        Number idNumber = (Number) data.get("id");
        int idTask = idNumber.intValue();
        String newText = (String) data.get("text");

        tasksDB.put(idTask, newText);
        responseData.put("status", "success");
        writeResponse(response, responseData);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        configureResponse(response);
        Map<String, Object> responseData = new HashMap<>();

        Map<String, Object> data = gson.fromJson(request.getReader(), Map.class);
        Number idNumber = (Number) data.get("id");
        int idTask = idNumber.intValue();

        if (!tasksDB.containsKey(idTask)){
            responseData.put("status", "error");
            responseData.put("info", "id is not exist (id = " + idTask + ")");
            writeResponse(response, responseData);
            return;
        }
        tasksDB.remove(idTask);


        responseData.put("status", "success");
        responseData.put("idTask", idTask);
        responseData.put("deleteText", tasksDB.get(idTask));

        writeResponse(response, responseData);
    }

    private void writeResponse(HttpServletResponse response, Map<String, Object> responseData) throws IOException {
        String jsonResponse = gson.toJson(responseData);
        response.getWriter().write(jsonResponse);
    }
}
