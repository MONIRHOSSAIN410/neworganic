import Banner from "../models/Banner.js";

export async function listBanners(req, res) {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
}

export async function listAllBanners(req, res) {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
}

export async function createBanner(req, res) {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to create banner" });
  }
}

export async function updateBanner(req, res) {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update banner" });
  }
}

export async function deleteBanner(req, res) {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete banner" });
  }
}
