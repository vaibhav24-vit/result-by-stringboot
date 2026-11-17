

Readme · MD
# Student Semester Result Management System
 
A responsive web-based Student Semester Result Management System built using **Java, Spring Boot, JavaScript, HTML, CSS, and MySQL**.
 
## Features
 
- Student information management
- Subject management
- Semester selection
- Internal and external marks entry
- Automatic total marks calculation
- Automatic grade calculation
- Pass/Fail status calculation
- Student result viewing
- Student search
- CRUD operations
- Input validation
- Dashboard statistics
- Responsive user interface
- MySQL database integration
- REST API integration
## Technology Stack
 
| Technology | Usage |
|---|---|
| Java | Backend programming |
| Spring Boot | Backend framework |
| Spring Web | REST APIs |
| Spring Data JPA | Database operations |
| Hibernate | ORM |
| MySQL | Database |
| HTML5 | Frontend structure |
| CSS3 | Frontend styling |
| JavaScript | Frontend functionality |
| Maven | Project build and dependency management |
 
## Application Screenshots
 
### Dashboard
 
![Dashboard](screenshots/dashboard.png)
 
### Student Management
 
![Student Management](screenshots/students.png)
 
### Subject Management
 
![Subject Management](screenshots/subjects.png)
 
### Result Management
 
![Result Management](screenshots/results.png)
 
## System Architecture
 
```text
Frontend
HTML + CSS + JavaScript
          |
          | REST API
          v
Spring Boot
          |
          v
Controller
          |
          v
Service
          |
          v
Repository
          |
          v
MySQL Database
```
 
## Project Structure
 
```text
springboot-student-result-manager/
│
├── .mvn/
│   └── wrapper/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── sppu/
│   │   │           └── result/
│   │   │               ├── controller/
│   │   │               ├── entity/
│   │   │               ├── repository/
│   │   │               ├── service/
│   │   │               └── ResultApplication.java
│   │   │
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html
│   │       │   ├── style.css
│   │       │   └── app.js
│   │       │
│   │       └── application.properties
│   │
│   └── test/
├── .gitignore
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```
 
## Database
 
The application uses MySQL for storing student, subject, and result data.
 
### Create Database
 
```sql
CREATE DATABASE student_result_db;
```
 
### Database Configuration
 
Configure the MySQL connection in:
 
```
src/main/resources/application.properties
```
 
Example:
 
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_result_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
 
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
 
server.port=8080
```
 
> **Note:** Do not commit real database passwords or credentials to GitHub.
 
## Database Entities
 
### Student
 
```text
Student
├── id
├── rollNo
├── name
├── course
├── branch
└── semester
```
 
### Subject
 
```text
Subject
├── id
├── subjectCode
├── subjectName
└── maxMarks
```
 
### Result
 
```text
Result
├── id
├── student
├── subject
├── internalMarks
├── externalMarks
├── totalMarks
├── grade
├── gradePoint
└── status
```
 
## Result Calculation
 
The application calculates total marks automatically.
 
```
Total Marks = Internal Marks + External Marks
```
 
Current marks structure:
 
```
Internal Marks = 30
External Marks = 70
Total Marks    = 100
```
 
Example:
 
```
Internal = 25
External = 60
 
Total = 25 + 60
      = 85 / 100
```
 
### Grade Calculation
 
| Marks | Grade | Grade Point | Status |
|---|---|---|---|
| 90–100 | A+ | 10 | PASS |
| 80–89 | A | 9 | PASS |
| 70–79 | B+ | 8 | PASS |
| 60–69 | B | 7 | PASS |
| 50–59 | C | 6 | PASS |
| 40–49 | D | 5 | PASS |
| Below 40 | F | 0 | FAIL |
 
## Validation
 
### Student Validation
 
- Roll number is required
- Roll number must be unique
- Student name is required
- Course is required
- Branch is required
- Semester must be between 1 and 8
### Marks Validation
 
- Internal Marks: 0–30
- External Marks: 0–70
Invalid marks are rejected before storing the result.
 
## Application Workflow
 
```text
Add Student
     |
     v
Add Subject
     |
     v
Select Student
     |
     v
Select Subject
     |
     v
Enter Internal Marks
     |
     v
Enter External Marks
     |
     v
Validate Marks
     |
     v
Calculate Total Marks
     |
     v
Calculate Grade
     |
     v
Calculate PASS / FAIL
     |
     v
Store Result in MySQL
     |
     v
View Student Result
```
 
## Installation
 
### Prerequisites
 
- Java JDK
- MySQL Server
- Git
- Maven or Maven Wrapper
- VS Code, IntelliJ IDEA, or Eclipse
### Clone Repository
 
```bash
git clone https://github.com/dhanshree58/springboot-student-result-manager.git
cd springboot-student-result-manager
```
 
### Create Database
 
```sql
CREATE DATABASE student_result_db;
```
 
### Configure MySQL
 
Update:
 
```
src/main/resources/application.properties
```
 
with your MySQL username and password.
 
### Run Application
 
Windows:
 
```bash
mvnw.cmd spring-boot:run
```
 
Or:
 
```bash
mvn spring-boot:run
```
 
### Open Application
 
```
http://localhost:8080
```
 
## Testing
 
The application can be tested with different student and result records.
 
### Student Testing
 
- Add valid student
- Add multiple students
- Test duplicate roll number
- Update student information
- Delete student
- Search student
### Marks Testing
 
- Enter valid internal marks
- Enter valid external marks
- Test marks above maximum limit
- Test zero marks
- Test passing marks
- Test failing marks
### Result Testing
 
- Create student result
- Retrieve student result
- Test multiple subjects
- Test PASS result
- Test FAIL result
- Delete result
## Future Improvements
 
- Semester-wise subject management
- SGPA calculation
- CGPA calculation
- Student login
- Faculty login
- Admin authentication
- Role-based access control
- PDF result generation
- Printable marksheet
- Excel export
- Result filtering
- Academic year management
- Cloud deployment
 
