import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.ResultSetMetaData;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

public class SybaseQuery {
    public static void main(String[] args) {
        if (args.length < 5) {
            System.err.println("Usage: java SybaseQuery <host> <port> <database> <username> <password>");
            System.exit(1);
        }

        String host = args[0];
        String port = args[1];
        String database = args[2];
        String username = args[3];
        String password = args[4];
        
        String dbUrl = "jdbc:jtds:sybase://" + host + ":" + port + "/" + database;

        try {
            String query = new String(Files.readAllBytes(Paths.get("query.sql")));
            Class.forName("net.sourceforge.jtds.jdbc.Driver");
            Connection connection = DriverManager.getConnection(dbUrl, username, password);
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);

            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            StringBuilder jsonResult = new StringBuilder();
            jsonResult.append("[");

            boolean firstRow = true;
            while (resultSet.next()) {
                if (!firstRow) {
                    jsonResult.append(",");
                }
                firstRow = false;

                jsonResult.append("{");
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnName(i);
                    String value = resultSet.getString(i);

                    jsonResult.append("\"").append(columnName).append("\":\"").append(value).append("\"");
                    if (i < columnCount) {
                        jsonResult.append(",");
                    }
                }
                jsonResult.append("}");
            }

            jsonResult.append("]");

            System.out.println(jsonResult.toString());

            resultSet.close();
            statement.close();
            connection.close();
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }
    }
}