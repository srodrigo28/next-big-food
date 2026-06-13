import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="relative h-full min-h-full w-full bg-white">
      <Image
        src="/TelaStart.png"
        alt="Tela inicial do ZapFood"
        fill
        sizes="480px"
        className="object-cover"
        priority
        unoptimized
      />
      <Link
        href="/admin/login"
        aria-label="Acessar estabelecimento"
        className="absolute rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        style={{
          left: "5.4%",
          top: "48.6%",
          width: "89.2%",
          height: "15.2%",
        }}
      />
      <Link
        href="/zap-food"
        aria-label="Acessar como cliente"
        className="absolute rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        style={{
          left: "5.4%",
          top: "65.8%",
          width: "89.2%",
          height: "15.2%",
        }}
      />
    </div>
  );
};

export default HomePage;
