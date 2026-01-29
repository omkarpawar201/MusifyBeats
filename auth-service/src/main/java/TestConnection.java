
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class TestConnection {
    public static void main(String[] args) {
        // Docker Connection String (Port 1433, User SA)
        String url = "jdbc:sqlserver://localhost:1433;databaseName=master;user=sa;password=MusifyApp123!;encrypt=false;trustServerCertificate=true;loginTimeout=10;";
        
        System.out.println("--------------------------------------------------");
        System.out.println("Testing Docker Connection: " + url);
        System.out.println("--------------------------------------------------");

        try {
            // Load driver
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            Connection conn = DriverManager.getConnection(url);
            System.out.println("✅✅✅ SUCCESS! Connected to Docker MSSQL (master DB)!");
            
            // Create Database if not exists
            Statement stmt = conn.createStatement();
            String sql = "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'musifybeats_db') CREATE DATABASE [musifybeats_db]";
            stmt.execute(sql);
            System.out.println("✅ Database 'musifybeats_db' checked/created successfully.");
            
            conn.close();
            
        } catch (Exception e) {
            System.out.println("❌ FAILED: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("--------------------------------------------------");
    }
}
