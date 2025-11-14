import { Button } from "@/components/ui/button";

interface RestaurantePageProps {
    params: Promise<{ slug: string }>;
}

const RestaurantePage = async ({ params }: RestaurantePageProps) => {
    const { slug } = await params; // Simulating fetching data based on slug
    return (
        <div className="p-4">
            <h1>Restaurante Page <Button>{slug}</Button> </h1>
            <p>This is the dynamic restaurant page.</p>
        </div>
    );
}

export default RestaurantePage;