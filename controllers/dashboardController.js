const endpointPartial = "http://localhost:3001";

// Handler for GET /data
exports.getDataDashboard = async (req, res) => {
  res.render("data", { layout: false });
};

// Handler for GET /basic-dashboard
// Consumes GET /basic-dashboard endpoint from the API
exports.getBasicDashboard = async (req, res) => {
  const userID = req.session.userID;
  const timePeriod = req.query.timePeriod;

  try {
    const response = await fetch(`${endpointPartial}/basic-dashboard/${userID}?timePeriod=${encodeURIComponent(timePeriod)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    // If the request failed, show an error message and return
    if (!response.ok) {
      return res.status(response.status).json({ message: data.message });
    }

    // Else on successful request, return the data
    res.status(200).json(data);

  } catch (err) {
    console.error("Error getting basic dashboard:", err);
    res.status(500).json({ message: "Failed to get basic dashboard" });
  }
};

exports.getCompletedByType = async (req, res) => {
  const userID = req.session.userID;
  const timePeriod = req.query.timePeriod;

  try {
    const response = await fetch(`${endpointPartial}/completed-by-type/${userID}?timePeriod=${encodeURIComponent(timePeriod)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    // If the request failed, show an error message and return
    if (!response.ok) {
      return res.status(response.status).json({ message: data.message });
    }

    // Else on successful request, return the data
    res.status(200).json(data);

  } catch (err) {
    console.error("Error getting completed by type:", err);
    res.status(500).json({ message: "Failed to get completed by type" });
  }
}

exports.getAverageCompletionTime = async (req, res) => {
  const userID = req.session.userID;
  const timePeriod = req.query.timePeriod;

  try {
    const response = await fetch(`${endpointPartial}/avg-completion-time/${userID}?timePeriod=${encodeURIComponent(timePeriod)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    // If the request failed, show an error message and return
    if (!response.ok) {
      return res.status(response.status).json({ message: data.message });
    }

    // Else on successful request, return the data
    res.status(200).json(data);

  } catch (err) {
    console.error("Error getting average completion time:", err);
    res.status(500).json({ message: "Failed to get average completion time" });
  }
}

exports.getCategoriesByType = async (req, res) => {
  const userID = req.session.userID;
  const timePeriod = req.query.timePeriod;

  try {
    const response = await fetch(`${endpointPartial}/categories-by-type/${userID}?timePeriod=${encodeURIComponent(timePeriod)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    // If the request failed, show an error message and return
    if (!response.ok) {
      return res.status(response.status).json({ message: data.message });
    }

    // Else on successful request, return the data
    res.status(200).json(data);

  } catch (err) {
    console.error("Error getting categories by type:", err);
    res.status(500).json({ message: "Failed to get categories by type" });
  }
}