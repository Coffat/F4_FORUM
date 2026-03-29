// Script check API response
async function checkAPI() {
  const token = ""; // Nếu cần token thì lấy từ cookie, nhưng hiện tại SecurityConfig đang permitAll /api/v1/classes/** 
  // Tuy nhiên courses/branches có thể bị chặn.
  
  try {
    const coursesRes = await fetch('http://localhost:8080/api/v1/courses');
    const courses = await coursesRes.json();
    console.log("COURSES API:", JSON.stringify(courses, null, 2));

    const branchesRes = await fetch('http://localhost:8080/api/v1/branches');
    const branches = await branchesRes.json();
    console.log("BRANCHES/ROOMS API:", JSON.stringify(branches, null, 2));
  } catch (e) {
    console.error("FETCH ERROR:", e);
  }
}

checkAPI();
