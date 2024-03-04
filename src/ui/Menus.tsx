import { createContext, useContext, useRef, useState } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';
import { useClickOutside } from '~/hooks/useClickOutside';

const Menu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

interface StyledListProps {
  $position?: { x: number; y: number } | null;
}

const StyledList = styled.ul<StyledListProps>`
  position: absolute;
  z-index: 1;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position?.x}px;
  top: ${(props) => props.$position?.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenuContextType {
  // openId, close, open, position, setPosition
  openId: number | null;
  close: () => void;
  open: (id: number) => void;
  position: { x: number; y: number } | null;
  setPosition: (position: { x: number; y: number } | null) => void;
}

const MenuContext = createContext<MenuContextType | null>(null);
const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

function Menus({ children }: { children: React.ReactNode }) {
  const [openId, setopenId] = useState<number | null>(null);
  const close = () => setopenId(null);
  const open = setopenId;

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  return (
    <MenuContext.Provider
      value={{
        openId,
        close,
        open,
        position,
        setPosition,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

function Toggle({ id }: { id: number }) {
  const { openId, open, close, setPosition } = useMenu();

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).closest('button')?.getBoundingClientRect();

    setPosition(
      rect
        ? {
            x: -8,
            y: rect.height,
          }
        : null
    );

    openId === null || openId !== id ? open(id) : close();
  };

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: { id: number; children: React.ReactNode }) {
  const { openId, position, close } = useMenu();
  const ref = useRef<HTMLUListElement>(null);
  useClickOutside(ref, close);

  if (openId !== id) return null;

  return (
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>
  );
}

function Botton({
  children,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const { close } = useMenu();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Botton;

export default Menus;
