import com.google.gson.Gson;

import java.io.PrintWriter;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/hello")
public class HelloServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson x = new Gson();
        Map<Integer, String> data = new HashMap<Integer, String>();
        data.put(1, "qewr");
        data.put(2, "rwtwe");
        data.put(3, "234535");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter writer = response.getWriter();

        String json = x.toJson(data);
        writer.print(json);
        writer.flush();
    }
}