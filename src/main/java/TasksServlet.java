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
    List<String> tasks = new ArrayList<>(Arrays.asList("task1", "task2", "task3"));

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        Gson gsonFile = new Gson();
//        Map<String, List> tasksData= new HashMap<String, List>(1);
//        tasksData.put("tasks", tasks);
        Map<String, Map<Integer, String>> tasksData = new HashMap<>(1);
        Map<Integer, String> tasksMap = new HashMap<>();

        for (int i = 0; i < tasks.size(); i++) {
            tasksMap.put(i + 1, tasks.get(i));
        }
        tasksData.put("tasks", tasksMap);


        PrintWriter writer = resp.getWriter();
        String json = gsonFile.toJson(tasksData);
        writer.print(json);
        writer.flush();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF-8");




        String newTask = req.getParameter("new_task");
        tasks.add(newTask);

        String path = "/index.html";
        ServletContext servletContext = getServletContext();
        RequestDispatcher requestDispatcher = servletContext.getRequestDispatcher(path);
        requestDispatcher.forward(req, resp);




    }
}
