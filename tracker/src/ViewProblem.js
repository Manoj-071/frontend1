import  { useEffect, useState } from "react";
import "./ViewProblems.css";
import InfoCard from "./InfoCard";
import { useLocation } from "react-router-dom";

export default function ViewProblem() {
    const location = useLocation();
    const username = location.state?.username || "Guest";
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [tagMap, setTags] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState([]);



  // Fetch problems
  useEffect(() => {
  fetch("http://localhost:8000/user_activity/")
    .then((res) => res.json())
    .then((data) => {
    //   console.log("API Response:", data);

      // Ensure data is always an array
      const userDataArray = Array.isArray(data) ? data : [data];

      // Extract activities
      const activities = userDataArray.flatMap((user) => user.activities || []);
      const descriptions = activities.map((activity) => activity.description);
      const links = activities.map((activity) => activity.link);
      setProblems(activities);
      setFilteredProblems(activities);

      // Extract unique tags
      const uniqueTags = [
        ...new Set(activities.map((p) => (p.tag?.tag ? p.tag.tag : "No Tag"))),
      ];
      setTags(uniqueTags);

      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching problems:", err);
      setLoading(false);
    });
    fetch("http://localhost:8000/tags/")
    .then((res) => res.json())
    .then((data) => {
    //   console.log("Tags API Response:", data);
      let tagMap = {};
      data.forEach((tag) => {
        tagMap[tag.tagid] = tag.tag;
      });
      setTags(tagMap);
      console.log("Tag Map:", tagMap);
    })
    .catch((err) => {
      console.error("Error fetching tags:", err);
    });
}, []);


useEffect(() => {
    let temp = problems;

    if (statusFilter) {
      temp = temp.filter((p) => p.status === statusFilter);
    }
    if (tagFilter) {
      temp = temp.filter((p) => tagMap[p.tag] === tagFilter);
    }
    if (platformFilter) {
      temp = temp.filter((p) => p.platform === platformFilter);
    }
    if (searchQuery) {
      temp = temp.filter((p) =>
        p.activity.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProblems(temp);
  }, [statusFilter, tagFilter, platformFilter, problems, searchQuery]);
//   console.log("Filtered Problems:",problems);

  return (
    <div className="view-container mt-4">
      <InfoCard />
      <h2 className="page-title">📖 View Problems</h2>
    <div className="col-3">
  <input
    type="text"
    className="form-control"
    placeholder="🔍 Search Problem..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
<br></br>
      {/* Filters */}
      <div className="filter-bar">
      <div className="row mb-3">
        <div className="col">
          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="col">
          <select onChange={(e) => setTagFilter(e.target.value)}>
            <option value="">All Tags</option>
            {[...new Set(problems.map((p) => p.tag))].map((tag) => (
              <option key={tagMap[tag]} value={tagMap[tag]}>
                {tagMap[tag]}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <select onChange={(e) => setPlatformFilter(e.target.value)}>
            <option value="">All Platforms</option>
            {[...new Set(problems.map((p) => p.platform))].map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
      </div>
</div>
      {/* Table */}
      <div className="grid">
      {filteredProblems.length > 0 ? (
        filteredProblems.map((problem, idx) => (
          <div
            key={idx}
            className="problem-card"
            onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
          >
            <h5 className="problem-title">{problem.activity}</h5>
            <span className="badge platform">{problem.platform}</span>
            <span
              className={`badge ${
                problem.status === "Easy"
                  ? "status-easy"
                  : problem.status === "Medium"
                  ? "status-medium"
                  : "status-hard"
              }`}
            >
              {problem.status}
            </span>
            <span className="badge tag">{tagMap[problem.tag]}</span>
            <span className="date">
              {new Date(problem.timestamp).toLocaleDateString()}
            </span>
            {expandedCard === idx && (
            <div className="problem-details mt-2">
              <p style={{color:"black"}}>{problem.description || "No description available."}</p>
              {problem.link && (
                <a href={problem.link} target="_blank" rel="noopener noreferrer">
                  🔗 Open Problem
                </a>
              )}
            </div>
          )}
        </div>
      ))
      ) : (
        <p className="no-data">🚫 No problems found</p>
      )}
    </div>
    </div>
  );
}
