import { ReactNode } from 'react-markdown/lib/react-markdown';
import classes from './DesktopNounActivityRow.module.css';

interface DesktopNounActivityRowProps {
  icon: ReactNode;
  primaryContent: ReactNode;
  secondaryContent?: ReactNode;
}

const DesktopNounActivityRow: React.FC<DesktopNounActivityRowProps> = props => {
  const { icon, primaryContent, secondaryContent } = props;


  return (
    <tr className={classes.wrapper}>
      <td className={classes.icon}>{icon}</td>
      <td className={classes.activityTableCell}>
        <div className={classes.infoContainer}>{primaryContent}</div>
      </td>
      <td>
        <div className={classes.secondaryContentWrapper}>
          <div className={classes.secondaryContentContainer}>{secondaryContent}</div>
        </div>
      </td>
    </tr>
  );
};

export default DesktopNounActivityRow;
