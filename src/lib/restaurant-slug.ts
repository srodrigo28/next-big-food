export const PRIMARY_RESTAURANT_SLUG = "zap-food";
export const LEGACY_RESTAURANT_SLUG = "fsw-donalds";

export const getRestaurantLookupSlugs = (slug: string) => {
  if (slug === PRIMARY_RESTAURANT_SLUG) {
    return [PRIMARY_RESTAURANT_SLUG, LEGACY_RESTAURANT_SLUG];
  }

  return [slug];
};

export const isMatchingRestaurantSlug = (
  restaurantSlug: string,
  requestedSlug: string,
) => {
  return (
    restaurantSlug === requestedSlug ||
    (requestedSlug === PRIMARY_RESTAURANT_SLUG &&
      restaurantSlug === LEGACY_RESTAURANT_SLUG)
  );
};

export const getPublicRestaurantSlug = () => PRIMARY_RESTAURANT_SLUG;
