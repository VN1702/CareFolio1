import { useState, useEffect } from "react";

const ProfileCard = () => {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    healthCondition: "",
  });

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("carefolioProfile"));
    if (savedProfile) setProfile(savedProfile);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("carefolioProfile", JSON.stringify(profile));
    alert("Profile saved!");
  };

  return (
    <div className="card p-4 shadow-sm">
      <h5 className="fw-bold text-primary mb-3">Profile</h5>
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="form-control mb-2"
        value={profile.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        className="form-control mb-2"
        value={profile.age}
        onChange={handleChange}
      />
      <input
        type="text"
        name="healthCondition"
        placeholder="Health Condition"
        className="form-control mb-3"
        value={profile.healthCondition}
        onChange={handleChange}
      />
      <button className="btn btn-primary w-100" onClick={handleSave}>
        Save Profile
      </button>
    </div>
  );
};

export default ProfileCard;
