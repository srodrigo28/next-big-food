import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <div className="flex justify-center items-center gap-5 bg-blue-700 h-44">
        <Button variant='default'>Default</Button>
        <Button variant='destructive'>Destructive</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='link'>Link</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='secondary'>Secondary</Button>
      </div>
    </div>
  );
}
