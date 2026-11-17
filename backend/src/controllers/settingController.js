import Setting from "../models/Setting.js";

const DEFAULT_SETTINGS = {
  key: "site_settings",
  shopName: "Savory Nest",
  shopLogo: "/image/savory.jpg",
  heroImage: "",
  heroTitle: "Nature's best,",
  heroAccent: "delivered fresh.",
  heroSubtitle: "GOOD FOOD, GOOD MOOD",
  heroCopy: "Shop honest ingredients, organic pantry essentials and everyday goodness for your family.",
  heroLink: "#products",
  hotline: "01758749698",
  address: "Khilkhet, Dhaka 1229",
  facebookLink: "https://www.facebook.com/savorynestbd",
};

export async function getSettings(req, res) {
  try {
    let settings = await Setting.findOne({ key: "site_settings" });
    if (!settings) {
      settings = await Setting.create(DEFAULT_SETTINGS);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
}

export async function updateSettings(req, res) {
  try {
    const settings = await Setting.findOneAndUpdate(
      { key: "site_settings" },
      { ...req.body, key: "site_settings" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update settings" });
  }
}
