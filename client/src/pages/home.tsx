import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { subjects } from "@shared/schema";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center px-4 sm:px-8 pt-8 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-nsw-navy mt-8 mb-4">
          NSW Life Skills Scope and Sequence Portal
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Interactive curriculum management platform for NSW Life Skills scope and sequences across multiple subjects
        </p>
      </div>

      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Scope and Sequence Hub</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/subject/${subject.id}`}>
              <Card 
                className="p-6 flex flex-col items-start hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 border border-gray-200"
                data-testid={`card-subject-${subject.id}`}
              >
                <span className="text-3xl mb-2" role="img" aria-label={subject.name}>
                  {subject.emoji}
                </span>
                <span className="font-semibold text-lg text-gray-900">
                  {subject.name}
                </span>
              </Card>
            </Link>
          ))}
          
          <Link href="/wizard">
            <Card 
              className="p-6 flex flex-col items-start hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 border border-gray-200 bg-gradient-to-br from-nsw-blue/5 to-nsw-light-blue/10"
              data-testid="card-subject-wizard"
            >
              <span className="text-3xl mb-2">⚡</span>
              <span className="font-semibold text-lg text-nsw-navy">
                Custom Wizard
              </span>
              <span className="text-sm text-gray-600 mt-2">
                Create your own custom scope and sequence
              </span>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="bg-nsw-navy text-white p-4 text-center text-sm mt-10">
        <p>&copy; 2025 NSW Special Education Programs. Portal v2.0</p>
      </footer>
    </div>
  );
}
