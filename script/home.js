const totalIssues = document.getElementById('total-issues');
const issuesContainer = document.getElementById("issues-container");

const updateIssues = () => {
    totalIssues.innerHTML = `${issuesContainer.children.length} Issues`;
    // console.log(totalIssues)
};


const getLabelIcon = (label) => {
    if (label === "bug") return "fa-solid fa-bug";
    if (label === "help wanted") return "fa-solid fa-life-ring";
    if (label === "enhancement") return "fa-solid fa-wand-magic-sparkles";
    return "fa-solid fa-tag";
};

const getLabelColor = (label) => {
    if (label === "bug") return "badge-error";
    if (label === "help wanted") return "badge-warning";
    if (label === "enhancement") return "badge-success";
    return "badge-outline";
};

const createElements = (arr) => {
    const htmlElements = arr.map(
        (el) => `
        <span class="badge badge-outline ${getLabelColor(el)}">
        <i class="${getLabelIcon(el)}"></i>
        ${el}
        </span>`,
    );
    return htmlElements.join(" ");
};

const removeActive = () => {
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(btn => btn.classList.remove('active'));
};

const formatDate = ((isoString) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`
});


const displayIssues = (issues) => {
    const issuesContainer = document.getElementById("issues-container");
    issuesContainer.innerHTML = "";

    //     {
    //     "id": 1,
    //     "title": "Fix navigation menu on mobile devices",
    //     "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
    //     "status": "open",
    //     "labels": [
    //         "bug",
    //         "help wanted"
    //     ],
    //     "priority": "high",
    //     "author": "john_doe",
    //     "assignee": "jane_smith",
    //     "createdAt": "2024-01-15T10:30:00Z",
    //     "updatedAt": "2024-01-15T10:30:00Z"
    // }
    issues.forEach((issue) => {
        // console.log(issue);
        const card = document.createElement("div");
        card.className = `card bg-base-100 shadow-sm p-5 flex flex-col ${issue.status === 'open' ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500'}`;

    
        card.innerHTML = `
        
            <div class="flex flex-col gap-4 flex-1 ">
                <div class="flex justify-between items-center">
                    ${issue.status === 'open' ? `<img src="assets/Open-Status.png" alt="Open Status">` : `<img src="assets/Closed-Status.png" alt="Close Status">`}
                    <span class="badge ${issue.priority.toLowerCase() === 'high' ? 'badge-error' : issue.priority.toLowerCase() === 'medium' ? 'badge-warning' : 'badge-neutral'}">${issue.priority}</span>
                </div>
                <div>
                    <h1 class="text-xl font-semibold text-[#1F2937]">${issue.title}</h1>
                    <p class="text-[#64748B] text-sm mt-1">${issue.description}</p>
                </div>
                <div class="flex gap-2 flex-wrap">
                    ${createElements(issue.labels)}
                </div>
            </div>

            <div class="mt-4">
                <hr class="border-gray-300 w-full mb-4">
                <div class="text-[#64748B] text-sm">
                    <p>#${issue.id} ${issue.author}</p>
                    <p>${formatDate(issue.createdAt)}</p>
                </div>
            </div>
        `;
        issuesContainer.append(card);
    });
    updateIssues();
};

const fetchIssues = async () => {
    const response = await fetch(
        "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    removeActive();
    const data = await response.json();

    // const allBtn = document.getElementById('all-btn');
    // allBtn.classList.add('active')
    // const openBtn = document.getElementById('open-btn');
    displayIssues(data.data);
}; 

fetchIssues();
const allBtn = document.getElementById("all-btn");
allBtn.addEventListener("click", fetchIssues);
