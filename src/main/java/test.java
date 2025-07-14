import java.util.*;

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


public class test {
    public static void main(String[] args) {
        Map<Integer, String> tasksDB = new HashMap<>();
        List<String> tasks = new ArrayList<>(Arrays.asList("task1", "task2", "task3"));//del

        for (int i = 0; i < tasks.size(); i++) {
            tasksDB.put(i + 1, tasks.get(i));
        } // del

        System.err.println(tasksDB.toString());
        tasksDB.put(1, "qwer");
        System.err.println(tasksDB.toString());
    }
}
