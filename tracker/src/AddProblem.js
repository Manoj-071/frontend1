// AddProblem.js
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./AddProblem.css";
import { useLocation } from "react-router-dom";
import InfoCard from "./InfoCard";

export default function AddProblem() {
  const location = useLocation();
  const username = location.state?.username || "Guest";  // ✅ receive username
  const [tags, setTags] = useState([]);
  const [tagid, setTagid] = useState("");
  const [platform, setPlatform] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");

  const platforms = [
    { value: "LeetCode", label: "LeetCode" },
    { value: "CodeChef", label: "CodeChef" },
    { value: "HackerRank", label: "HackerRank" },
    { value: "GeeksforGeeks", label: "GeeksforGeeks" },
    { value: "Codeforces", label: "Codeforces" },
    { value: "Others", label: "Others" }
  ];

  useEffect(() => {
    fetch("http://localhost:8000/tags/")
      .then((res) => res.json())
      .then((data) => {
        const options = data.map(tag => ({
          value: tag.tagid,
          label: tag.tag
        }));
        setTags(options);
      })
      .catch((err) => console.error("Error fetching tags:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/addproblem/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity,
        description,
        status,
        tag: tagid,
        platform,
        user: username,   // ✅ username received from login
        link,
      })
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Problem added successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("❌ Failed to add problem.");
      });
      console.log("Form submitted with data:", {
        activity,
        description,
        status,
        tag_id: tagid,
        platform,
        user: username,
        link,
      });
  };

  return (
    <div className="page-container">
      <InfoCard />
      <header className="header">
        <br></br>
        <h1>📌 Add New Problem</h1>
      </header>

      <form className="problem-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="activity"
            placeholder="Problem Name"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />

          <select
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>
        </div>

        {/* Searchable Tag Dropdown */}
        <div className="form-group">
          <Select
            id="tag"
            name="tag_id"
            options={tags}
            onChange={(opt) => setTagid(opt ? opt.value : "")}
            value={tags.find(tag => tag.value === tagid) || null}
            placeholder="Search & Select Tag"
            isClearable
          />
        </div>

        {/* Platform Dropdown */}
        <div className="form-group">
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          >
            <option value="">Select Platform</option>
            {platforms.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <input
            type="url"
            name="link"
            placeholder="Problem Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Approach"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}
