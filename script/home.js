let allIssues = [];

const totalIssues = document.getElementById('total-issues');
const issuesContainer = document.getElementById("issues-container");

const updateIssues = () => {
    totalIssues.innerHTML = `${issuesContainer.children.length} Issues`;
    // console.log(totalIssues)
};

const manageSpinner = (status) => {
    if(status == true) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('issues-container').classList.add('hidden');
    }
    else {
        document.getElementById('issues-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
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

const formatDate = ((isoString) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`
});

const formatName = (name) => {
    return name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const loadIssueDetail = async(id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayIssueDetail(details.data)
};

// {
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

const displayIssueDetail = (issue) => {
    console.log(issue)
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
        <h2 class="text-2xl font-bold">${issue.title}</h2>
                    <div class="flex items-center gap-2">
                        <div class="badge badge-success text-white">${issue.status}</div>
                        <span class="w-1 h-1 bg-[#64748B] rounded-full inline-block"></span>
                        <p class="text-[#64748B] ">Opened by ${formatName(issue.assignee ? formatName(issue.assignee) : 'None')}</p>
                        <span class="w-1 h-1 bg-[#64748B] rounded-full inline-block"></span>
                        <p class="text-[#64748B]">${formatDate(issue.createdAt)}</p>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        ${createElements(issue.labels)}
                    </div>
                    <p class="text-[#64748B]">${issue.description}</p>
                    <div class="flex gap-20 bg-base-200 p-5 rounded-md">
                        <div>
                            <p class="text-[#64748B] font-normal">Assignee:</p>
                            <h3 class="text-[#1F2937] text-lg font-semibold">${formatName(issue.assignee) ? formatName(issue.assignee) : 'Not Assigned'}</h3>
                        </div>
                        <div>
                            <p class="text-[#64748B] font-normal">Priority:</p>
                            <span class="text-white badge ${issue.priority.toLowerCase() === 'high' ? 'badge-error' : issue.priority.toLowerCase() === 'medium' ? 'badge-warning' : 'badge-neutral'}">${issue.priority}</span>
                        </div>
                    </div>
    
    `;
    document.getElementById('issue_modal').showModal();
};

const displayIssues = (issues) => {
    const issuesContainer = document.getElementById("issues-container");
    issuesContainer.innerHTML = "";

    issues.forEach((issue) => {
        // console.log(issue);
        const card = document.createElement("div");
        card.className = `card bg-base-100 shadow-sm p-5 flex flex-col ${issue.status === 'open' ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500'}`;

    
        card.innerHTML = `
        <div onclick='loadIssueDetail(${issue.id})'>
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
        </div>
        `;
        issuesContainer.append(card);
    });
    updateIssues();
    manageSpinner(false);
};

const removeActive = () => {
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(btn => btn.classList.remove('active'));
};

const filterIssueCards = (status) => {
    manageSpinner(true);
    // console.log(status)
    removeActive();

    let filteredIssues = [];
    if(status === 'all') {
        filteredIssues = allIssues;
    } else if(status === 'open') {
        filteredIssues = allIssues.filter(issue => issue.status === 'open')
    } else if(status === 'closed') {
        filteredIssues = allIssues.filter(issue => issue.status === 'closed')
    }

    displayIssues(filteredIssues);
    document.getElementById(`${status}-btn`).classList.add('active');
};

const fetchIssues = async () => {
    manageSpinner(true);
    const response = await fetch(
        "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await response.json();
    
    allIssues = data.data;
    filterIssueCards('all');
    // displayIssues(data.data);
}; 

fetchIssues();
document.getElementById("all-btn").addEventListener("click", () => filterIssueCards("all"));
document.getElementById("open-btn").addEventListener("click", () => filterIssueCards("open"));
document.getElementById("closed-btn").addEventListener("click", () => filterIssueCards("closed"));
