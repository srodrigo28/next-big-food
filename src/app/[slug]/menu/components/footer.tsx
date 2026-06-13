import { Card, CardContent } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="flex items-center justify-center bg-white">
      <Card className="mb-3 mt-3 w-[300px] rounded-xl border-gray-200">
        <CardContent className="px-5 py-3 text-center">
          <p className="text-sm text-gray-400">
            Desenvolvido com{" "}
            <span className="font-bold text-[#FFB100]">Next Big Food</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
