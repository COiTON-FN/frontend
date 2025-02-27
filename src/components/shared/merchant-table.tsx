import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  generateAvatarFromAddress,
  getCountryByCode,
  truncateAddr,
} from "@/lib/utils";
import { Link } from "react-router-dom";
import { Listing } from "@/pages/(app)/dashboard/dashboard.page";
import { cairo } from "starknet";

const MerchantTable = ({
  filteredListings,
}: {
  filteredListings: Listing[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="!border-b-0 hover:bg-transparent">
          <TableHead className="w-[337px] text-base">Property Owner</TableHead>
          <TableHead className="text-base">Type</TableHead>
          <TableHead className="text-base">Region</TableHead>
          <TableHead className="text-base">Price</TableHead>
          <TableHead className="text-right text-base">Details</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredListings.map((listing: Listing) => {
          const country = getCountryByCode(listing.details?.region?.country.countryCode);

          const avatar = generateAvatarFromAddress(listing.owner);

          return (
            <TableRow
              key={listing.id}
              className="!border-b border-[#E0E0E0] last-of-type:!border-b-0 hover:bg-transparent"
            >
              <TableCell>
                <Link
                  to={`/profile/${listing.owner}`}
                  className="flex items-center gap-4 text-base"
                >
                  <div className="size-14 overflow-hidden rounded-full bg-secondary">
                    <img
                      src={avatar}
                      alt={`Avatar for ${listing.owner}`}
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="font-medium">
                    {truncateAddr(listing.owner)}
                  </span>
                </Link>
              </TableCell>

              <TableCell className="text-base capitalize">
                {listing.details?.propertyType || "N/A"}
              </TableCell>

              <TableCell className="text-base">
                <div className="flex items-center gap-2">
                  {country?.flag && (
                    <span className="text-2xl">{country.flag}</span>
                  )}
                  <span className="font-medium">
                    {country?.name || "Unknown"}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-base">
                ${Number(listing.details?.rangeTo ?? 0).toLocaleString()}
              </TableCell>

              <TableCell className="text-right text-base">
                <Link
                  to={`/property?type=${cairo.felt("dao")}`}
                  state={listing}
                  className="flex items-center justify-end gap-2"
                >
                  <span>View More</span>
                  <span>
                    <svg
                      className="size-5"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <g clipPath="url(#clip0_1043_1705)">
                        <path
                          d="M3.88867 13.6108L14.8053 4.88465"
                          stroke="#1A1E26"
                          strokeWidth="1.26984"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.0709 4.39461L14.8081 4.88423L14.9707 8.85645"
                          stroke="#1A1E26"
                          strokeWidth="1.26984"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1043_1705">
                          <rect
                            width="7.40741"
                            height="17.5887"
                            fill="white"
                            transform="translate(5.56055 18.0649) rotate(-131.155)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>

      <TableFooter className="border-t-0 !bg-transparent">
        <TableRow className="!bg-transparent hover:!bg-transparent">
          <TableCell className="text-base" colSpan={4}>
            {filteredListings.length} list
            {filteredListings.length !== 1 ? "s" : ""} found
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default memo(MerchantTable);
