import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  fetchTodosStartAsync,
  deleteTodoStartAsync,
} from "../../redux/todos-redux/todos.actions";
import { connect } from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import TransitionsModal from "../../components/todo-edit-modal.component";
import AddItemModal from "../../components/todo-add-modal.component";
import DeleteForeverRounded from "@material-ui/icons/DeleteForeverRounded";
import blue from "@material-ui/core/colors/blue";
import { CheckCircle, CheckCircleOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  todoImage: {
    height: "20vmin",
    pointerEvents: "none",
  },
  card: {
    padding: theme.spacing(2),
    position: "relative",
  },
  delete: {
    position: "absolute",
    top: "10px",
    left: "10px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginLeft: "auto",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  length: {
    fontSize: "16px",
    color: blue,
  },
}));

const TodoContainer = ({
  fetchTodosStartAsync,
  deleteTodoStartAsync,
  todos,
  isFetching,
}) => {
  const [page, setPage] = useState(1);
  const [minimum, setMinimum] = useState(0);
  const [maximum, setMaximum] = useState(10);
  const [pageTodos, setPageTodos] = useState([]);
  const classes = useStyles();
  const count = Math.ceil(todos.length / 10);

  useEffect(() => {
    fetchTodosStartAsync();
  }, [fetchTodosStartAsync]);

  useEffect(() => {
    setPageTodos(todos.slice(minimum, maximum));
  }, [page, isFetching, todos, minimum, maximum]);

  const handleChange = (event, value) => {
    setPage(value);
    setMinimum((value - 1) * 10);
    setMaximum(value * 10);
  };

  return (
    <Box className={classes.root}>
      <Typography variant={"h2"} component={"h1"}>
        todos <strong className={classes.length}> [{todos.length}]</strong>
      </Typography>
      <AddItemModal />

      <Grid container justify={"center"} alignItems={"center"} spacing={4}>
        {pageTodos.map((each) => (
          <Grid item xs={10} sm={5} md={3} key={each.id}>
            <Paper className={classes.card} elevation={10}>
              {each.id}
              <DeleteForeverRounded
                color={"primary"}
                className={classes.delete}
                onClick={() => deleteTodoStartAsync(each.id)}
              />

              <Typography>{each.title}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckCircleOutline />}
                    checkedIcon={<CheckCircle />}
                    name="checkedH"
                    checked={each.completed}
                  />
                }
                label="Completed"
              />

              <Box>
                <TransitionsModal key={each.id} todo={each} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={count}
        page={page}
        onChange={handleChange}
        className={classes.pagination}
        color="primary"
        variant="outlined"
        size="small"
      />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchTodosStartAsync: () => dispatch(fetchTodosStartAsync()),
  deleteTodoStartAsync: (id) => dispatch(deleteTodoStartAsync(id)),
});

const mapStateToProps = (state) => ({
  todos: state.todos.todos,
  isFetching: state.todos.isFetching,
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoContainer);