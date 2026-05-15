import { Router } from "express";
import { CarService } from "../services/car.service";

const r = Router();
const cars = new CarService();

/** GET /api/cars — paginated list + filters (see query params). */
r.get("/", async (req, res, next) => {
  try {
    const idsParam = req.query.ids as string | undefined;
    const result = await cars.list({
      search: req.query.search as string | undefined,
      brand: req.query.brand as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      year: req.query.year ? Number(req.query.year) : undefined,
      fuel: req.query.fuel as string | undefined,
      transmission: req.query.transmission as string | undefined,
      bodyType: req.query.bodyType as string | undefined,
      ids: idsParam ? idsParam.split(",").filter(Boolean) : undefined,
      sort: req.query.sort as any,
      cursor: req.query.cursor as string | undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

/** GET /api/cars/featured — homepage carousel. */
r.get("/featured", async (_req, res, next) => {
  try {
    const data = await cars.featured();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

/** GET /api/cars/:slug — detail page (public). */
r.get("/:slug", async (req, res, next) => {
  try {
    const data = await cars.bySlug(req.params.slug);
    const similar = await cars.similar(data.id, data.brand);
    res.json({ success: true, data: { ...data, similar } });
  } catch (e) {
    next(e);
  }
});

export const carRouter = r;
