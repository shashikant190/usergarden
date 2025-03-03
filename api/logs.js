import { Octokit } from "octokit";

export default async function handler(req, res) {
  // GitHub Configuration
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = process.env.GITHUB_REPO.split('/');
  const path = "userLogs.txt";

  // Handle Increment Request
  if (req.method === 'POST') {
    try {
      // Get current file content
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner, repo, path
      });

      // Decode and update content
      let content = Buffer.from(fileData.content, 'base64').toString();
      const today = new Date().toISOString().split('T')[0];
      
      // Update count logic
      if (content.includes(today)) {
        content = content.replace(
          new RegExp(`${today},(\\d+)`),
          (match, count) => `${today},${parseInt(count) + 1}`
        );
      } else {
        content += `\n${today},1`;
      }

      // Commit changes
      await octokit.rest.repos.createOrUpdateFileContents({
        owner, repo, path,
        message: `Update user count - ${today}`,
        content: Buffer.from(content).toString('base64'),
        sha: fileData.sha
      });

      return res.status(200).json({ success: true });

    } catch (error) {
      console.error('GitHub API Error:', error);
      return res.status(500).json({ error: 'Failed to update count' });
    }
  }

  // Handle Get Logs Request
  if (req.method === 'GET') {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner, repo, path
      });
      
      const content = Buffer.from(data.content, 'base64').toString();
      const logs = content.split('\n').slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [date, count] = line.split(',');
          return { date, count: parseInt(count) };
        });

      return res.status(200).json(logs);

    } catch (error) {
      console.error('GitHub API Error:', error);
      return res.status(500).json({ error: 'Failed to fetch logs' });
    }
  }

  return res.status(405).end(); // Method not allowed
}