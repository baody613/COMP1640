using System;

class TestBCrypt
{
    static void Main(string[] args)
    {
        string password = "password123";
        string existingHash = "$2a$11$8GvBJz9VX4qYq5T1kZXLmefL.p3yKYYR9.cOLKLvZJqVvJqWXqD8O";
        
        Console.WriteLine("Testing BCrypt...");
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Existing Hash: {existingHash}");
        
        // Test verify
        bool isValid = BCrypt.Net.BCrypt.Verify(password, existingHash);
        Console.WriteLine($"Verify result: {isValid}");
        
        // Generate new hash
        string newHash = BCrypt.Net.BCrypt.HashPassword(password);
        Console.WriteLine($"New Hash: {newHash}");
        
        // Verify new hash
        bool isNewHashValid = BCrypt.Net.BCrypt.Verify(password, newHash);
        Console.WriteLine($"New hash verify: {isNewHashValid}");
    }
}
