import { Probot, ProbotOctokit } from 'probot';
import { commands } from './commands';

export = (app: Probot) => {
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({
      body: `## Hello folks :${await getRandomEmoji(context.octokit)}:!

Thanks @${context.payload.issue.user.login} for your issue!
      `,
    });
    await context.octokit.issues.createComment(issueComment);
  });
  commands(app, 'label', (context, command) => {
    const labels = command.arguments.split(/, */);
    return context.octokit.issues.addLabels(context.issue({ labels }));
  });
  commands(app, 'gfi', (context) => {
    return context.octokit.issues.addLabels(context.issue({ labels: ['good first issue'] }));
  });
  commands(app, 'bug', (context) => {
    return context.octokit.issues.addLabels(context.issue({ labels: ['bug'] }));
  });
};

async function getRandomEmoji(octokit: InstanceType<typeof ProbotOctokit>) {
  const res = await octokit.emojis.get();
  const names = Object.keys(res.data);
  const emoji = names[Math.trunc(Math.random() * names.length)];
  return { name: emoji, image: res.data[emoji] };
}
