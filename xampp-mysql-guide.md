# XAMPP MySQL Console Guide (No phpMyAdmin)

## YOUR LOCAL DATABASE CREDENTIALS (From .env)
- DB_HOST: localhost
- DB_USER: root
- DB_PASSWORD: rAmjig861@
- DB_NAME: woolcraft

---

## 1. Locate XAMPP's MySQL Binaries

First, find where XAMPP is installed! By default, it's:
- `C:\xampp\mysql\bin` (if you installed XAMPP in C:\)

## 2. Open Command Prompt as Administrator

1. Press `Win + X`
2. Select **Windows Terminal (Admin)** or **Command Prompt (Admin)**

## 3. Navigate to XAMPP's MySQL Folder

Run this command (adjust path if your XAMPP is elsewhere):
```cmd
cd C:\xampp\mysql\bin
```

## 4. Export Your WoolCraft Database (Backup)

Run this command to export your database to a file:
```cmd
mysqldump -u root -prAmjig861@ woolcraft > woolcraft-database.sql
```

## 5. Import a Database

To import an SQL file:
```cmd
mysql -u root -prAmjig861@ woolcraft < woolcraft-database.sql
```

## 6. List All Databases

To see your databases:
```cmd
mysql -u root -prAmjig861@ -e "SHOW DATABASES;"
```

## 7. Create a New Database (If Needed)

```cmd
mysql -u root -prAmjig861@ -e "CREATE DATABASE woolcraft;"
```

