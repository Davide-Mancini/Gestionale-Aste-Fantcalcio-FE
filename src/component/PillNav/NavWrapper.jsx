import { useDispatch } from "react-redux";

import PillNav from "./PillNav";
import { showProfileModalAction } from "../../redux/actions/modaleProfiloAction";

const defaultNavItems = [
  { label: "ASTA", href: "/impostazioni-asta" },
  { label: "STRATEGIA", href: "/strategia" },
  { label: "CAMPETTO", href: "/campetto" },
];

const NavWrapper = (props) => {
  const dispatch = useDispatch();
  const handleShowProfile = () => {
    dispatch(showProfileModalAction());
  };
  const itemsWithProfile = [
    ...defaultNavItems,
    { label: "PROFILO", href: "#", onClick: handleShowProfile },
  ];

  return <PillNav {...props} items={itemsWithProfile} />;
};

export default NavWrapper;
