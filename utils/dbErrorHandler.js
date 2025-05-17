function isDatabaseError(err) {
  return err && err.code && typeof err.code === "string";
}

function handleDatabaseError(err) {
  switch (err.code) {
    case "ER_DUP_ENTRY":
      return {
        status: 400,
        message:
          "A unique field already exists (e.g., email address). Please use a different value.",
      };

    case "ER_NO_REFERENCED_ROW_2":
    case "ER_ROW_IS_REFERENCED_2":
      return {
        status: 400,
        message:
          "Invalid reference provided (e.g., shift ID or employee ID does not exist).",
      };

    case "ER_BAD_NULL_ERROR":
      return {
        status: 400,
        message: "A required field is missing or null.",
      };

    case "ER_DATA_TOO_LONG":
      return {
        status: 400,
        message: "Data too long for a column.",
      };

    case "ER_PARSE_ERROR":
      return {
        status: 400,
        message: "SQL syntax error.",
      };

    case "ER_ACCESS_DENIED_ERROR":
      return {
        status: 403,
        message: "Access denied to the database.",
      };

    case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
    case "ER_TRUNCATED_WRONG_VALUE":
    case "WARN_DATA_TRUNCATED":
      return {
        status: 400,
        message:
          "Invalid data type or malformed value provided (e.g., phone_number is not a number).",
      };

    case "ER_BAD_FIELD_ERROR":
      return {
        status: 400,
        message: `Unknown column used in your SQL query. Please check your field names.`,
      };

    default:
      return {
        status: 500,
        message: "An unexpected database error occurred.",
      };
  }
}

module.exports = { isDatabaseError, handleDatabaseError };
