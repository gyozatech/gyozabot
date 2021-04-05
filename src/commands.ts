import { Probot } from 'probot';

type Callback = (_: any, __: any) => void;

class Command {
  constructor(private name: string, private callback: Callback) {}

  get matcher() {
    return /^\/([\w]+)\b *(.*)?$/m;
  }

  listener(context: any) {
    const { comment, issue, pull_request: pr } = context.payload;
    const command = (comment || issue || pr).body.match(this.matcher);

    if (command && this.name === command[1]) {
      return this.callback(context, { name: command[1], arguments: command[2] });
    }
  }
}

export const commands = (robot: Probot, name: string, callback: Callback) => {
  const command = new Command(name, callback);
  robot.on('issue_comment.created', command.listener.bind(command));
};
