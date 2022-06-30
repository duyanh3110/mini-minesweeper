import { useRoutes } from "react-router-dom";
import Board from "../pages/Board";
import NotFound from "../pages/NotFound";
import Welcome from "../pages/Welcome";
import { useAppSelector } from "../redux/hooks";
export const AppRoutes = () => {
  const gameLevel = useAppSelector((state) => state.game.level);

  const commonRoutes = [{ index: true, element: <Welcome /> }];

  const element = useRoutes([
    ...commonRoutes,
    gameLevel ? { path: "/game", element: <Board /> } : {},
    { path: "*", element: <NotFound /> },
  ]);

  return <>{element}</>;
};

export default AppRoutes;
