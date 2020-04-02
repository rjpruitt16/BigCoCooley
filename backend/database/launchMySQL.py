#!python3
import argparse
from subprocess import call

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('containerName', metavar='name', type=str,
                    help='The name of the container')
parser.add_argument('dbPassword', metavar='password', type=str,
                    help='The password for the mysql service')
parser.add_argument('--port', default='3306', type=str,
                    help='The port to forward the database')
parser.add_argument('--containerTag', default='latest', type=str,
                    help='The docker version specificed by a tag')
parser.add_argument('--commandLineClient', default=False, type=bool,
                    help='The docker version specificed by a tag')

args = parser.parse_args()

startDBCommand = ["docker", "run", "--name", args.containerName, "-p", args.port+":3306", "-e",
                  "MYSQL_ROOT_PASSWORD="+args.dbPassword, "-d", "mysql:" + args.containerTag,
                  ]

call(startDBCommand)
