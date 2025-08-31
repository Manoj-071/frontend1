// DashboardBootstrap.jsx (React + Bootstrap + Recharts)
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLocation } from "react-router-dom";
import InfoCard from "./InfoCard";

const Dashboard = () => {
  const location = useLocation();
  const username = location.state?.username || "Guest";

  const [stats, setStats] = useState({
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [barData, setBarData] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);
  const [piedata, setPieData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/tags/").then((res) => {
        if (!res.ok) throw new Error(`Tags fetch failed: ${res.status}`);
        return res.json();
      }),
      fetch("http://localhost:8000/dashboard/").then((res) => {
        if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);
        return res.json();
      }),
    ])
      .then(([tags, data]) => {
        // Build tag map
        let tagMap = {};
        tags.forEach((tag) => {
          tagMap[tag.tagid] = tag.tag;
        });

        // Pie data
        const pie = data.tags.map((tagObj) => ({
          name: tagMap[tagObj.tag],
          value: tagObj.count || 0,
        }));

        const totalCount = pie.reduce((sum, t) => sum + t.value, 0);

        // Update state
        setStats({
          easy: data.easy || 0,
          medium: data.medium || 0,
          hard: data.hard || 0,
          totalSolved: (data.easy || 0) + (data.medium || 0) + (data.hard || 0),
        });
        setBarData([
          { difficulty: 'Easy', value: data.easy || 0 },
          { difficulty: 'Medium', value: data.medium || 0 },
          { difficulty: 'Hard', value: data.hard || 0 },
        ]);
        setRecentProblems(data.activity || []);
        setPieData(pie);
        setTotal(totalCount);
      })
      .catch((error) => {
        console.error("Error loading dashboard:", error);
      });
  }, []);

  const BAR_COLORS = ['#28a745', '#ffc107', '#dc3545'];
  const COLORS = ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="container-fluid py-4">
      <InfoCard username={username} />
      <br></br><br></br>
      <h1 className="mb-4">Hi {username} 👋</h1>

      {/* Stat cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Total Solved</h6>
              <h3>{stats.totalSolved}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Easy</h6>
              <h3 className="text-success">{stats.easy}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Medium</h6>
              <h3 className="text-primary">{stats.medium}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h6 className="text-muted">Hard</h6>
              <h3 className="text-danger">{stats.hard}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        {/* Pie */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Topic-wise Distribution</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={piedata}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => {
                      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                      return `${name} (${percent}%)`;
                    }}
                  >
                    {piedata.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, nm) => {
                      const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                      return [`${val} (${percent}%)`, nm];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Solved by Difficulty</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {barData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Recent Problems</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Platform</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentProblems.map((problem, idx) => (
                <tr key={idx}>
                  <td>{problem.title || problem.activity || '-'}</td>
                  <td>{problem.difficulty || problem.status || '-'}</td>
                  <td>{problem.platform || problem.site || '-'}</td>
                  <td>{problem.date || (problem.timestamp ? problem.timestamp.slice(0, 10) : '-')}</td>
                </tr>
              ))}
              {(!recentProblems || recentProblems.length === 0) && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No recent problems
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
