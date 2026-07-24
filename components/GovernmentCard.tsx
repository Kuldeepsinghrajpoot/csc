import Link from "next/link";
import { ArrowUpRight, ExternalLink, Link2, Link2OffIcon, Star } from "lucide-react";
import { GovernmentPortal } from "@/types/portal";
interface GovernmentCardProps {
  portal: GovernmentPortal;
}

const GovernmentCard = ({ portal }: GovernmentCardProps) => {
  const Icon = portal.icon;

  return (
    <Link
      href={portal.website}
      target="_blank"
      className="group flex h-56 flex-col justify-between overflow-hidden rounded-sm bg-white px-4 py-5 shadow-sm transition duration-300 hover:-translate-y-3 hover:shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${portal.color}`}>
          <Icon size={30} />
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <ExternalLink size={18} />
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-xl font-bold text-slate-800 transition group-hover:text-blue-500">
          {portal.name}
        </h3>
        <p className="mt-2 text-gray-600">
          {portal.description}
        </p>
      </div>

      <div className="mt-2 rounded-sm bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
        {portal.website}
      </div>
    </Link>
  );
};

export default GovernmentCard;