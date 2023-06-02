import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getTeamById } from 'apiSdk/teams';
import { Error } from 'components/error';
import { TeamInterface } from 'interfaces/team';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteEventById } from 'apiSdk/events';
import { deleteCoachById, createCoach } from 'apiSdk/coaches';
import { deletePlayerById, createPlayer } from 'apiSdk/players';

function TeamViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TeamInterface>(
    () => (id ? `/teams/${id}` : null),
    () =>
      getTeamById(id, {
        relations: ['academy', 'event', 'coach', 'player'],
      }),
  );

  const eventHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteEventById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [coachUserId, setCoachUserId] = useState(null);
  const coachHandleCreate = async () => {
    setCreateError(null);
    try {
      await createCoach({ team_id: id, user_id: coachUserId });
      setCoachUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const coachHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCoachById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [playerUserId, setPlayerUserId] = useState(null);
  const playerHandleCreate = async () => {
    setCreateError(null);
    try {
      await createPlayer({ team_id: id, user_id: playerUserId });
      setPlayerUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const playerHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Team Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                academy: <Link href={`/academies/view/${data?.academy?.id}`}>{data?.academy?.name}</Link>
              </Text>
            )}
            {hasAccess('event', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Event
                </Text>
                <Link href={`/events/create?team_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>name</Th>
                        <Th>description</Th>
                        <Th>date</Th>
                        <Th>time</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.event?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.name}</Td>
                          <Td>{record.description}</Td>
                          <Td>{record.date as unknown as string}</Td>
                          <Td>{record.time as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/events/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/events/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => eventHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            <>
              <Text fontSize="md" fontWeight="bold">
                Coach
              </Text>
              <UserSelect name={'coach_user'} value={coachUserId} handleChange={setCoachUserId} />
              <Button colorScheme="blue" mr="4" onClick={coachHandleCreate} isDisabled={!coachUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.coach?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>
                          <Button>
                            <Link href={`/users/view/${record?.user?.id}`}>View</Link>
                          </Button>
                        </Td>
                        <Td>
                          <Button onClick={() => coachHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>

            <>
              <Text fontSize="md" fontWeight="bold">
                Player
              </Text>
              <UserSelect name={'player_user'} value={playerUserId} handleChange={setPlayerUserId} />
              <Button colorScheme="blue" mr="4" onClick={playerHandleCreate} isDisabled={!playerUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>position</Th>
                      <Th>date_of_birth</Th>
                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.player?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>{record?.user?.position}</Td>
                        <Td>{record?.user?.date_of_birth as unknown as string}</Td>
                        <Td>
                          <Button>
                            <Link href={`/users/view/${record?.user?.id}`}>View</Link>
                          </Button>
                        </Td>
                        <Td>
                          <Button onClick={() => playerHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'team',
  operation: AccessOperationEnum.READ,
})(TeamViewPage);
