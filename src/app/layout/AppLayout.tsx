import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";

import AppHeader from "@/app/layout/AppHeader";

const AppLayout = ({ children }: PropsWithChildren) => (
  <>
    <AppHeader />
    <Container fluid className="content">{children ?? <Outlet />}</Container>
  </>
);

export default AppLayout;