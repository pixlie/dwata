import aioamqp
import importlib


MQ_EXCHANGE_NAME = "dwata_mq_exchange"


async def run_workers(all_workers):
    try:
        transport, protocol = await aioamqp.connect()
        channel = await protocol.channel()
        await channel.exchange_declare(
            exchange_name=MQ_EXCHANGE_NAME,
            type_name="topic",
            durable=True
        )

        for binding in all_workers:
            result = await channel.queue_declare(
                queue_name=binding[0].__name__,
                durable=True
            )
            queue_name = result["queue"]

            for key in binding[1]:
                await channel.queue_bind(
                    exchange_name=MQ_EXCHANGE_NAME,
                    queue_name=queue_name,
                    routing_key=key
                )
            await channel.basic_consume(
                callback=binding[0],
                queue_name=queue_name,
                no_ack=binding[2]
            )
    except aioamqp.AmqpClosedConnection:
        raise Exception("Can not connect to RabbitMQ, please make sure it is running")


def manage_workers():
    try:
        import asyncio
    except ImportError:
        raise Exception("You have to install asyncio to run workers,"
                        " see documentation for ERROR_WORKERS_REQUIREMENTS")

    try:
        import aioamqp
    except ImportError:
        raise Exception("You have to install aioamqp to run workers,"
                        " see documentation for ERROR_WORKERS_REQUIREMENTS")

    # Search for workers.setup_workers in all apps
    all_workers = []

    for app in []:
        try:
            workers = importlib.import_module("apps.%s.workers" % app)
            if hasattr(workers, "setup_workers"):
                all_workers.append(*workers.setup_workers())
            print("INFO: Worker found in app {}".format(app))
        except ImportError:
            print("INFO: No worker found in app {}".format(app))

    if not all_workers:
        return False

    if all_workers is not False:
        # loop = self.app.loop
        loop = asyncio.get_event_loop()
        try:
            loop.run_until_complete(run_workers(all_workers=all_workers))
            loop.run_forever()
        except aioamqp.exceptions.ChannelClosed as e:
            if e.code == 404:
                print("It seems that the RabbitMQ exchange {} does not exist,"
                      " perhaps nothing has been published to it".format(MQ_EXCHANGE_NAME))


if __name__ == "__main__":
    manage_workers()
