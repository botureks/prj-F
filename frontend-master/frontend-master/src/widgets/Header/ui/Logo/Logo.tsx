import Link from "next/link";

import { LogoIcon } from "src/shared/ui/Icons/LogoIcon";

export default function Logo() {
    return (
        <Link href={"/"}>
            <LogoIcon/>
        </Link>
    )
}