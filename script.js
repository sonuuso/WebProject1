async function fetchStudentInfo() {
    const usn = document.getElementById('usnInput').value;
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch(`/api/student/${usn}`);
        if (!response.ok) {
            throw new Error('Student not found');
        }
        const student = await response.json();
        displayResult(student);
    } catch (error) {
        // Display error in bold text and larger font size
        resultDiv.innerHTML = `<p style="color: red; text-align: center; font-size: 1.5em; font-weight: bold;">${error.message}</p>`;
    }
}

function displayResult(student) {
    const resultDiv = document.getElementById('result');

    // Prepare data for the graph
    const subjects = Array.isArray(student.semMarks)
        ? student.semMarks.map(([semester]) => semester) // Get semester labels (keys)
        : [];
    const marksArray = Array.isArray(student.semMarks)
        ? student.semMarks.map(([, mark]) => mark) // Get marks (values)
        : [];

    // Clear previous result
    resultDiv.innerHTML = `
        <h2>Student Details</h2>
        <p><strong>USN:</strong> ${student.usn}</p>
        <canvas id="marksChart" width="400" height="200"></canvas>
        <p><strong>MOOC Courses:</strong> ${student.moocCourses}</p>
        <p><strong>Hackathons Participated:</strong> ${student.hackathons}</p>
        <p><strong>AICTE Activity Points:</strong> ${student.aictePoints}</p>
        <p><strong>Academic Projects:</strong> ${student.projects}</p>
        <p><strong>Internships/Seminar Reports:</strong> ${student.internships}</p>
    `;

    // Create an array of darker colors for each bar
    const colors = [
        'rgba(75, 0, 130, 0.6)', // Indigo
        'rgba(139, 0, 139, 0.6)', // Dark Violet
        'rgba(0, 0, 128, 0.6)',   // Navy
        'rgba(0, 100, 0, 0.6)',   // Dark Green
        'rgba(128, 0, 0, 0.6)',   // Maroon
        'rgba(165, 42, 42, 0.6)', // Brown
        'rgba(255, 69, 0, 0.6)',   // Red-Orange
    ];

    // Ensure colors match the number of subjects
    const backgroundColors = marksArray.map((_, index) => colors[index % colors.length]);

    // Create the chart
    const ctx = document.getElementById('marksChart').getContext('2d');
    const marksChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects, // Subjects for the x-axis
            datasets: [{
                label: 'Semester Marks',
                data: marksArray, // Marks for the y-axis
                backgroundColor: backgroundColors,
                borderColor: [],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Marks'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Semesters'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}