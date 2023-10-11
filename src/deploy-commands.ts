import { Client, REST, Routes } from 'discord.js'

const deployCommands = (client: Client) => {
    
    if (client.commands.size > 0) {

        const commands: string[] = []

        client.commands.forEach((command) => {
            commands.push(command.data.toJSON())
        })

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);

        // and deploy your commands!
        (async () => {
            try {
                console.log(
                    `Started refreshing ${commands.length} application (/) commands.`
                )

                // The put method is used to fully refresh all commands in the guild with the current set
                rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID!), {
                    body: commands
                }).then((data: any) => {
                    console.log(
                        `Successfully reloaded ${data.length} application (/) commands.`
                    )
                })
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error)
            }
        })()
    }
}

export default deployCommands
