import GraphQLJSON from 'graphql-type-json'
import shortid from 'shortid'


export default {
    JSON: GraphQLJSON,

    Query: {
        mainTasks: (root, args, {db}) => db.get('tasks').value(),
        subTasks: (root, args, {db}) => db.get('sub_tasks').filter({taskID: args.taskID}).value(),
    },

    MainTask: {
        subTasks: (root, args, {db}) => {
            return db.get('sub_tasks').filter((subTask) => subTask.taskID === root.id).value();
        }
    },
    Mutation: {
        addSubTask: (root, {input}, {pubsub, db}) => {
            const subTask = {
                id: shortid.generate(),
                text: input.text,
                taskID: input.taskID,
                completed: false
            };
            db.get('sub_tasks').push(subTask).last().write();
            pubsub.publish('sub_tasks', {subTaskAdded: subTask});
            return subTask;
        },
        addMainTask: (root, {input}, {pubsub, db}) => {
            const mainTask = {
                id: shortid.generate(),
                name: input.name,
            };
            db.get('tasks').push(mainTask).last().write();
            pubsub.publish('tasks', {mainTaskAdded: mainTask});
            return mainTask;
        },
        deleteMainTask: (root, {id}, {db}) => {
            const task = db.get('tasks').find({id: id}).value();
            db.get('tasks').remove(task).write();
            db.get('sub_tasks').remove({taskID: task.id}).write();
            return task;
        },
        deleteSubTask: (root, {id}, {db}) => {
            const subTask = db.get('sub_tasks').find({id: id}).value();
            db.get('sub_tasks').remove(subTask).write();
            return subTask;
        },
        updateMainTask: (root, {input}, {db}) => {
            const task = db.get('tasks').find({id: input.id}).assign({name: input.name}).value();
            db.write();
            return task;
        },
        updateSubTask: (root, {input}, {db}) => {
            const subTask = db.get('sub_tasks').find({id: input.id}).assign({text: input.text, completed: input.completed}).value();
            db.write();
            return subTask;
        },
    },

    Subscription: {
        subTaskAdded: {
            subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator('sub_tasks'),
        },
        mainTaskAdded: {
            subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator('tasks'),
        }
    },
}
