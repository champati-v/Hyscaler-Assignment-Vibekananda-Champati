const DateFormat = ({date}) => {

const formattedDate = new Date(date).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

return (
    <span>{formattedDate}</span>
  )
}

export default DateFormat