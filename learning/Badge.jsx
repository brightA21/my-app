import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useState } from 'react'

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

export default function IconButtonWithBadge() {
  const [count, setCount] = useState(0);
  
  const IconClick = () => {
    setCount(prev => prev + 1);
  }
  


  return (
    <IconButton onClick={IconClick}>
      <ShoppingCartIcon fontSize="small" />
      <CartBadge badgeContent={count}
       color="primary"
       overlap="circular"
       showZero />
    </IconButton>
  );
}
