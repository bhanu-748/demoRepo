// backend/controller/profileController.js

const Profile = require("../model/profileModel");
const User = require("../model/userModel");

const ProfileController = {
  // GET /api/profile/user/:id
  async getUserProfile(req, res) {
    try {
      const { id } = req.params;   // <-- FIXED

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const profile = await Profile.findOne({ where: { user_id: id } });

      return res.status(200).json(profile ? profile.toJSON() : null);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /api/profile
  async upsertProfile(req, res) {
    try {
      const {
        user_id,
        phone,
        date_of_birth,
        address,
        city,
        state,
        country,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
      } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }

      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let dob = date_of_birth ? new Date(date_of_birth) : null;

      const existing = await Profile.findOne({ where: { user_id } });

      let profile;
      if (!existing) {
        profile = await Profile.create({
          user_id,
          phone,
          date_of_birth: dob,
          address,
          city,
          state,
          country,
          postal_code,
          emergency_contact_name,
          emergency_contact_phone,
        });
      } else {
        await existing.update({
          phone,
          date_of_birth: dob,
          address,
          city,
          state,
          country,
          postal_code,
          emergency_contact_name,
          emergency_contact_phone,
        });
        profile = existing;
      }

      return res.status(200).json({
        message: "Profile saved successfully",
        profile: profile.toJSON(),
      });

    } catch (err) {
      console.error("Error saving profile:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = ProfileController;
