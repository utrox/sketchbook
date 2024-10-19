import { Tooltip } from "@mui/material";

const DATE_SETTINGS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

export const simplifyTimePassed = (dateString: string): string => {
  const postDate = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  const minutes = Math.floor(secondsAgo / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Approximation

  if (secondsAgo < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (days < 30) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  } else if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    // Return full date for old posts

    // Using undefined as the locale will default to the user's browser settings
    return postDate.toLocaleDateString(undefined, DATE_SETTINGS);
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  // Using undefined as the locale will default to the user's browser settings
  return date.toLocaleDateString(undefined, DATE_SETTINGS);
};

const simplifiedTimeWithTooltip = (dateString: string): JSX.Element => {
  return (
    <Tooltip
      title={formatDate(dateString)}
      className="mui-tooltip"
      /*
        The default offset was too big, had to modify 
        it so it's closer to the hovered element.
      */
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -14],
              },
            },
          ],
        },
      }}
    >
      <div>{simplifyTimePassed(dateString)}</div>
    </Tooltip>
  );
};

export const simplifyCreationEditionTime = (
  createdAt: string,
  updatedAt: string
): JSX.Element => {
  if (updatedAt === createdAt) {
    return simplifiedTimeWithTooltip(createdAt);
  } else {
    const createdTimeElement = simplifiedTimeWithTooltip(createdAt);
    const updatedTimeElement = simplifiedTimeWithTooltip(updatedAt);
    return (
      <div style={{ display: "flex" }}>
        {createdTimeElement}
        {/* 
          React strips whitespaces, so it would smush the 3 components
          together. I've opted to force the whitespace with margin.
        */}
        <span style={{ margin: "0 4px" }}>- Last edit:</span>
        {updatedTimeElement}
      </div>
    );
  }
};
