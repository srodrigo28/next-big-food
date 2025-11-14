interface ProductPageProps {
    params: Promise<{ slug: string; productid: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
    return (
        <div>g
            <h1>Product Page</h1>
            <p>Slug: {(await params).slug}</p>
            <p>Product ID: {(await params).productid}</p>
        </div>
    );
}

export default ProductPage;