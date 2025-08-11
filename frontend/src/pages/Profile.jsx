/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { toast } from "react-toastify";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  gender: "",
  dob: "",
  bio: "",
  profileImage: "",
  coverImage: ""
};

export default function Profile() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        const data = res.data && res.data.user ? res.data.user : res.data;
        if (!mounted) return;
        setForm((prev) => ({
          ...prev,
          ...data,
          dob: data?.dob ? data.dob.split("T")[0] : "",
          socialLinks: data?.socialLinks || [],
          interests: data?.interests || [],
          profileImage: data?.profileImage || "",
          coverImage: data?.coverImage || ""
        }));
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute completeness percentage based on a handful of relevant fields
  const completeness = () => {
    const keys = [
      "name",
      "email",
      "phone",
      "location",
      "gender",
      "dob",
      "bio",
      "profileImage",
      "coverImage"
    ];
    let filled = keys.reduce((acc, k) => acc + (form[k] ? 1 : 0), 0);
    if ((form.socialLinks || []).length > 0) filled += 1;
    if ((form.interests || []).length > 0) filled += 1;
    const total = keys.length + 2; // 9 + 2 = 11
    return Math.round((filled / total) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!form.name?.trim()) return "Name is required.";
    if (!form.email?.trim()) return "Email is required.";
    // simple email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) return "Please enter a valid email.";
    return null;
  };

  const handleAvatarClick = () => avatarInputRef.current?.click();
  const handleCoverClick = () => coverInputRef.current?.click();

  const uploadImage = async (file, field = "profileImage") => {
  if (!file) return null;
  const data = new FormData();
  // The backend expects "profileImage" or "coverImage" as keys
  data.append(field, file);

  try {
    if (field === "profileImage") {
      setAvatarUploading(true);
    } else {
      setCoverUploading(true);
    }
    setUploadingPercent(0);

    // CHANGE THIS URL to your correct upload route:
    const res = await api.post("/auth/upload-images", data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadingPercent(pct);
      }
    });

    const imageUrl = res?.data?.imageUrl || res?.data?.url || res?.data?.image || null;
    const updatedUser = res?.data?.user || (res?.data && Object.keys(res.data).length > 1 ? res.data : null);

    if (imageUrl) {
      setForm((p) => ({ ...p, [field]: imageUrl }));
    }
    if (updatedUser) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    toast.success("Image uploaded");
    return imageUrl;

  } catch (err) {
    toast.error("Image upload failed");
    console.error(err);
    return null;
  } finally {
    setUploadingPercent(0);
    setAvatarUploading(false);
    setCoverUploading(false);
  }
};


  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // client-side preview before upload
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, profileImage: reader.result }));
    reader.readAsDataURL(file);
    // then upload
    await uploadImage(file, "profileImage");
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, coverImage: reader.result }));
    reader.readAsDataURL(file);
    await uploadImage(file, "coverImage");
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    const err = validate();
    if (err) return toast.error(err);
    setSaving(true);
    try {
      const payload = { ...form };
      // Send arrays as-is; backend should accept them
      const res = await api.put("/auth/me", payload);
      const updated = res?.data?.user || res?.data;
      if (updated) {
        setForm((p) => ({ ...p, ...updated, dob: updated?.dob ? updated.dob.split("T")[0] : p.dob }));
        localStorage.setItem("user", JSON.stringify(updated));
      }
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Failed to save profile.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    // just reload from server
    setLoading(true);
    try {
      const res = await api.get("/auth/me");
      const data = res.data && res.data.user ? res.data.user : res.data;
      setForm((p) => ({
        ...emptyForm,
        ...data,
        dob: data?.dob ? data.dob.split("T")[0] : "",
        socialLinks: data?.socialLinks || [],
        interests: data?.interests || []
      }));
      toast.info("Changes discarded");
    } catch (err) {
      toast.error("Could not reload profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="container my-5 py-5"
    >
      <div className="position-relative mb-4 shadow rounded" aria-busy={loading}>
        <div
          className="rounded-top"
          style={{
            height: 200,
            backgroundImage: `url(${form.coverImage || "https://via.placeholder.com/1200x400?text=Cover+Image"})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="position-absolute top-0 end-0 m-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCoverClick}
              className="btn btn-sm btn-light shadow"
              title="Change cover image"
            >
              <i className="bi bi-camera"></i> Change cover
            </motion.button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleCoverChange}
            />
          </div>
        </div>

        <div className="bg-white rounded-bottom px-3 pt-3 pb-2">
          <div className="d-flex flex-column flex-md-row align-items-center">
            <div className="mx-auto mx-md-0 me-md-3 position-relative" style={{ marginTop: -60 }}>
              <motion.div whileHover={{ scale: 1.03 }}>
                <img
                  src={form.profileImage || "https://via.placeholder.com/150"}
                  alt="avatar"
                  className="rounded-circle border border-3 border-white shadow"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAvatarClick}
                  className="btn btn-sm btn-light position-absolute bottom-0 end-0"
                  style={{ transform: "translate(20%, 20%)" }}
                  title="Change avatar"
                >
                  <i className="bi bi-camera"></i>
                </motion.button>
              </motion.div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-grow-1 text-center text-md-start mt-3 mt-md-0">
              <h4 className="mb-0">{form.name || "Your Name"}</h4>
              <p className="text-muted">{form.email || "you@example.com"}</p>

              <div className="mt-2">
                <small className="text-muted">Profile completeness</small>
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className="progress-bar bg-dark"
                    role="progressbar"
                    style={{ width: `${completeness()}%` }}
                    aria-valuenow={completeness()}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <small className="text-muted">{completeness()}% complete</small>
              </div>
            </div>

            <div className="ms-md-3 mt-3 mt-md-0 text-center text-md-end w-100 w-md-auto">
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="btn btn-outline-secondary text-dark me-2"
                onClick={handleCancel}
                disabled={saving || loading}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Cancel
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                className="btn btn-dark"
                onClick={handleSave}
                disabled={saving || loading}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" /> Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i> Save changes
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* small upload progress indicator */}
        {(avatarUploading || coverUploading) && (
          <div className="position-absolute" style={{ right: 16, top: 180 }}>
            <div className="card p-2 shadow">
              <small>Uploading: {uploadingPercent}%</small>
              <div className="progress mt-1" style={{ height: 4 }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${uploadingPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FORM */}
      <motion.form
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        onSubmit={handleSave}
        className="card shadow"
      >
        <div className="card-body">
          <h5 className="text-dark fw-bold mb-3">Personal Information</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full name</label>
              <div onClick={() => setEditingField("name")}>
                {editingField === "name" ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingField(null);
                    }}
                    className="form-control"
                    autoFocus
                  />
                ) : (
                  <p className="form-control bg-light" style={{ cursor: "pointer" }}>
                    {form.name || <em className="text-muted">Click to enter name</em>}
                    <i className="bi bi-pencil ms-2 text-muted" />
                  </p>
                )}
              </div>
            </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <div onClick={() => setEditingField("email")}>
                  {editingField === "email" ? (
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="form-control"
                      autoFocus
                    />
                  ) : (
                    <p className="form-control bg-light" style={{ cursor: "pointer" }}>
                      {form.email || <em className="text-muted">Click to enter email</em>}
                      <i className="bi bi-pencil ms-2 text-muted" />
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <div onClick={() => setEditingField("phone")}>
                  {editingField === "phone" ? (
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="form-control"
                      autoFocus
                    />
                  ) : (
                    <p className="form-control bg-light" style={{ cursor: "pointer" }}>
                      {form.phone || <em className="text-muted">Click to enter phone</em>}
                      <i className="bi bi-pencil ms-2 text-muted" />
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">Location</label>
                <div onClick={() => setEditingField("location")}>
                  {editingField === "location" ? (
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="form-control"
                      autoFocus
                    />
                  ) : (
                    <p className="form-control bg-light" style={{ cursor: "pointer" }}>
                      {form.location || <em className="text-muted">Click to enter location</em>}
                      <i className="bi bi-pencil ms-2 text-muted" />
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">Gender</label>
                <div onClick={() => setEditingField("gender")}>
                  {editingField === "gender" ? (
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      onBlur={() => setEditingField(null)}
                      className="form-select"
                      autoFocus
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="form-control bg-light" style={{ cursor: "pointer" }}>
                      {form.gender || <em className="text-muted">Click to select gender</em>}
                      <i className="bi bi-pencil ms-2 text-muted" />
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">Date of birth</label>
                <div onClick={() => setEditingField("dob")}>
                  {editingField === "dob" ? (
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      onBlur={() => setEditingField(null)}
                      className="form-control"
                      autoFocus
                    />
                  ) : (
                    <p className="form-control bg-light" style={{ cursor: "pointer" }}>
                      {form.dob || <em className="text-muted">Click to enter DOB</em>}
                      <i className="bi bi-pencil ms-2 text-muted" />
                    </p>
                  )}
                </div>
              </div>


            <div className="col-md-8">
              <label className="form-label">Short bio</label>
              <div onClick={() => setEditingField("bio")}>
                {editingField === "bio" ? (
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEditingField(null);
                    }}
                    className="form-control"
                    rows={3}
                    autoFocus
                  />
                ) : (
                  <p className="form-control bg-light" style={{ cursor: "pointer", minHeight: "100px" }}>
                    {form.bio || <em className="text-muted">Click to enter a short bio</em>}
                    <i className="bi bi-pencil ms-2 text-muted" />
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={handleCancel} disabled={loading || saving}>
              Discard
            </button>
            <button type="submit" className="btn btn-dark" disabled={saving || loading}>
              {saving ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-save me-2"></i>
              )}
              Save profile
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}