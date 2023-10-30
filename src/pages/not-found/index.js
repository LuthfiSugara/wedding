import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BCA, BNI, Background, Man, Scooter, WeddingCouple, Woman } from '../../assets';
import { Box, Button,  Grid, GridItem, HStack, Image, Input, SimpleGrid, Spinner, Stack, Text, Textarea, VStack } from '@chakra-ui/react';
import { Calendar, Clock, Clock2, Copy, Envelope, Map, Pause, Play } from '../../assets/icons';
import { copyText, useCountdown } from '../../hooks';
import { Toast } from '../../components';
import { useFormik } from 'formik'
import * as Yup from "yup";
import { Music } from '../../assets/music';
import { useInView } from 'react-intersection-observer';
import { API } from '../../config/api';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Fade, Zoom } from 'react-reveal';
import Flip from 'react-reveal/Flip';
import LightSpeed from 'react-reveal/LightSpeed';
import Wave from 'react-wavify';

const Index = () => {
    const { name } = useParams();
    
    const LIMIT = 3;
    const { createToast } = Toast();
    const { ref, inView } = useInView();
    const {days, hours, minutes, seconds} = useCountdown('2023-11-18 08:00:00');
    const song = useRef(new Audio(Music));
    const queryClient = useQueryClient();

    const [step, setStep] = useState(0),
    [isPlaying, setIsplaying] = useState(false),
    [loadAction, setLoadAction] = useState(false),
    [guestName, setGuestName] = useState('Nama Tamu Undangan');

    useEffect(() => {
      if(name){
        let arrName = name.split('+');
        let tmpGuestName = '';
        arrName.map((word) => {
          if(word == 'dan' || word == 'Dan'){
            tmpGuestName += word.charAt(0).toLowerCase() + word.slice(1) + ' ';
          }else{
            tmpGuestName += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
          }
        })
        setGuestName(tmpGuestName);
      }
    }, []);

    const toggleAudio = () => {
      if(isPlaying){
        setIsplaying(false)
        song.current.pause();
      }else{
        setIsplaying(true);
        song.current.loop = true;
        song.current.play();
      }
    }


    const {
      status,
      data,
      error,
      isFetching,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
    } = useInfiniteQuery(
      "list-messages",
      async ({ pageParam = 1 }) => {
        const res = await API.get(
          `/wedding-messages?page=${pageParam}&limit=${LIMIT}`
        );
  
        return res.data;
      },
      {
        getNextPageParam: (lastPage) => {
          if (
            Number(lastPage.metadata.current_page) < Number(lastPage.metadata.total_pages)
          ) {
            return Number(lastPage.metadata.current_page) + 1;
          }
        },
      }
    );

    useEffect(() => {
      if (inView) {
        fetchNextPage();
      }
    }, [inView]);

    const {
      handleSubmit,
      setFieldValue,
      errors,
      values,
      touched,
      resetForm,
  } = useFormik({
      initialValues: {
          name: "",
          description: "",
      },
      validationSchema: Yup.object({
          name: Yup.string().required("Mohon isi nama anda"),
          description: Yup.string().required("Mohon isi ucapan untuk kedua mempelai"),
      }),
      onSubmit: async (values) => {
        console.log('values bundle : ', values);
        onSubmit(values);
      },
  });

  const apiCreateMessage = async (data) => {
    const res = await API.post("/create-message", data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    });
    return res;
  };

  const handleCreateMsg = useMutation({
    mutationKey: ["create-message"],
    mutationFn: apiCreateMessage,
    onMutate: async (newTodo) => {
      setLoadAction(true);
    },
    onError: (error, variables, context) => {
      setLoadAction(false);
      createToast('Pesan gagal dikirim', "error", "", "bottom-right");
    },
    onSettled: () => {
      setLoadAction(false);
    },
    onSuccess: (success) => {
      queryClient.refetchQueries({ queryKey: ["list-messages"]});
      setLoadAction(false);
      if(success.data.status.toLowerCase() === 'success'){
        createToast('Pesan berhasil dikirim', "success", "", "bottom-right");
        resetForm();
      }else{
        createToast('Pesan gagal dikirim', "error", "", "bottom-right");
      }
    },
  });

  const onSubmit = async (data) => {
    await handleCreateMsg.mutate(data);
  };
    
  return (
    <Box
        style={{
            backgroundImage: `url(${Background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: 'auto'
        }}
        color={'#8a613a'}
    >
      {step === 0 ? (          
          <HStack justify={'center'}  width={['95%']} height={'100vh'} mx={'auto'} pt={{sm: 4, lg: 0 }} pb={{ sm: 8, lg: 0 }}>
            <VStack justify={'center'} width={'full'} height={['auto', 'auto', '100vh']} zIndex={5}>
              <Text fontWeight={'bold'} fontSize={['4xl', '4xl', '5xl']} mt={4} textAlign={'center'} className='font-great' casing={'capitalize'}>Undangan Pernikahan</Text>
              <HStack justify={'center'}>
                <Box position={'relative'} display={'block'} width={['90%', '55%', '35%', '35%', '45%']}>
                  <Image src={WeddingCouple} width={'100%'} objectFit={'cover'} />
                </Box>
              </HStack>
              <Stack
                gap={6}
                direction={{lg: 'row'}}
                fontSize={['4xl', '5xl']} 
              >
                <Fade right>
                  <Text 
                    mt={4}
                    fontWeight={'bold'}
                    textAlign={'center'}
                    className='font-great'
                  >
                    Endang
                  </Text>
                </Fade>
                <Text 
                  mt={4}
                  fontWeight={'bold'}
                  textAlign={'center'}
                  className='font-great'
                >
                  &
                </Text>
                <Fade left>
                  <Text 
                    mt={4}
                    fontWeight={'bold'}
                    textAlign={'center'}
                    className='font-great'
                  >
                    Luthfi
                  </Text>
                </Fade>
              </Stack>
              <Text fontSize={['md', 'md']} fontWeight={'semibold'} mt={4} textAlign={'center'}>Kpd Bpk/Ibu/Saudara/i</Text>
              <Text fontSize={['2xl', '2xl']} fontWeight={'bold'} my={2} textAlign={'center'}>{guestName}</Text>
              <Text 
                mt={2} 
                fontWeight={'semibold'} 
                fontSize={['md', 'lg']}
                width={['95%', '95%', '50%']} 
                textAlign={'center'}
              >
                Merupakan suatu kehormatan bagi kami, apabila bapak/ibu/saudara/i berkenan hadir untuk memberikan do'a restu kepada Kami.
              </Text>
              <Button
                mt={[4, 4]}
                color={'white'}
                background={'#e37811'}
                className='zoom-in-out-btn'
                size={['sm']}
                _hover={{ background: '#a55a13' }}
                onClick={() => {
                  setStep(1)
                  toggleAudio();
                }}
              >
                <Image src={Envelope} /> 
                <Text ml={2} fontWeight={'bold'}>Buka Undangan</Text>
              </Button>
            </VStack>
          </HStack>
      ): (
        <Box
          background={'##FFFFFFB8'}
        >
          <Box
            p={1}
            right={0}
            top={'50%'}
            bg={'#e37811'}
            position={'fixed'}
            cursor={'pointer'}
            borderLeftRadius={'50%'}
            onClick={() => {
              toggleAudio();
            }}
          >
            {isPlaying ? (
              <Image src={Pause} alt='Pause' />
            ) : (
              <Image src={Play} alt='play' />
            )}
            <audio loop muted autoPlay id="videomain">
              <source src={Music} type="audio/mp3"></source>
            </audio>
          </Box>

          <Box
            style={{
              backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
              height: 'auto'
            }}
          >
            {/* section 1 */}
            <VStack height={['auto']} justify={'center'} width={'full'} m={'auto'} pt={[10]} pb={{ sm: 8, lg: 0 }}>
              <Text 
                fontWeight={'bold'} 
                textAlign={'center'}
                fontSize={['3xl', '4xl', '5xl']}
              >
                Save the date
              </Text>
              <Text 
                mb={4}
                fontWeight={'bold'} 
                textAlign={'center'}
                fontSize={['xl', '2xl',  '3xl']} 
              >
                Wedding Invitation
              </Text>
              <Box position={'relative'} display={'block'} width={['90%', '55%', '35%', '30%', '22%']}>
                <Image src={WeddingCouple} width={'100%'} objectFit={'cover'} />
              </Box>
              <Stack gap={[4]} textAlign={'center'} direction={{sm: 'col', lg: 'row'}} align={'center'}>
                <Fade right>
                  <Text fontSize={['4xl', '5xl', '6xl']} fontWeight={'bold'} className='font-great'>Endang</Text>
                </Fade>
                <Text fontSize={['3xl', '4xl', '5xl']} fontWeight={'bold'} className='font-great'>&</Text>
                <Fade left>
                  <Text fontSize={['4xl', '5xl', '6xl']} fontWeight={'bold'} className='font-great'>Luthfi</Text>
                </Fade>
              </Stack>
              <Box textAlign={'center'} fontWeight={'bold'} mt={[4, 0]}>
                <Text fontSize={['2xl', 'xl', '2xl', '2xl']} p={0} m={0} mb={2}>Sabtu</Text>
                <SimpleGrid columns={3} gap={2}>
                  <Box textAlign={'end'}>
                    <Text fontSize={['xl', 'xl']} p={0} m={0}>18</Text>
                  </Box>
                  <Box borderX={'2px'} borderColor={'#c87e10'} textAlign={'center'}>
                    <Text fontSize={['xl', 'xl']} p={0} m={0}>11</Text>
                  </Box>
                  <Box textAlign={'center'}>
                    <Text fontSize={['xl', 'xl']} p={0} m={0}>2023</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <HStack width={['90%', '75%', '50%']} mt={5}>
                <SimpleGrid columns={[4, 4]} spacing={2} width={'100%'}>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['xl', 'xl']} fontWeight={'bold'}>{days}</Text>
                    <Text fontSize={['md', 'xl']} fontWeight={'semibold'}>Hari</Text>
                  </Box>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['xl', 'xl']} fontWeight={'bold'}>{hours}</Text>
                    <Text fontSize={['md', 'xl']} fontWeight={'semibold'}>Jam</Text>
                  </Box>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['xl', 'xl']} fontWeight={'bold'}>{minutes}</Text>
                    <Text fontSize={['md', 'xl']} fontWeight={'semibold'}>Menit</Text>
                  </Box>
                  <Box bg={'#d99452'} width={'full'} textAlign={'center'} color={'white'} borderRadius={'lg'} p={2}>
                    <Text fontSize={['xl', 'xl']} fontWeight={'bold'}>{seconds}</Text>
                    <Text fontSize={['md', 'xl']} fontWeight={'semibold'}>Detik</Text>
                  </Box>
                </SimpleGrid>
              </HStack>

              <Button
                mt={8}
                color={'white'}
                rounded={'2xl'}
                background={'#d99452'}
                _hover={{ background: '#e7af7a' }}
                onClick={() => {
                  window.open("https://calendar.google.com/calendar/u/0/r/eventedit?text=Pernikahan+Luthfi+dan+Endang&dates=20231118T010000Z/20231118T150000Z&ctz=Asia/Jakarta");
                }}
              >
                <Image src={Clock2} /> 
                <Text ml={2}>Ingatkan Saya</Text>
              </Button>
            </VStack>
            <Box height={10}>
              <Wave mask="url(#mask)" fill="#d99452">
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0" stopColor="white" />
                    <stop offset="0.5" stopColor="black" />
                  </linearGradient>
                  <mask id="mask">
                    <rect x="0" y="0" width="100%" height="75%" fill="url(#gradient)"  />
                  </mask>
                </defs>
              </Wave>
            </Box>
          </Box>

          {/* section 2 */}
          <Box
            style={{
              backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
              height: 'auto'
            }}
          >
            <HStack justify={'center'} px={[2]} pt={[12]} pb={8}>
              <VStack height={['auto', 'auto',]} width={'97%'} justify={'center'} align={'center'}>
                <Zoom>
                  <Text fontWeight={'bold'} fontSize={['xl', '2xl', '3xl']} mb={4} textAlign={'center'}>بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</Text>
                </Zoom>
                <Zoom>
                  <Text
                    mb={8}
                    fontSize={['md', 'xl', 'xl', '2xl']}
                    fontWeight={'bold'}
                    textAlign={'center'}
                    width={['98%', '95%', '75%', '55%']}
                    mx={'auto'}
                  >
                    Dengan memohon Rahmat dan Ridho dari Allah SWT. Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.
                  </Text>
                </Zoom>
                <HStack justify={'center'}>
                  <Grid 
                    templateRows={['repeat(1, 1fr)', 'repeat(1, 1fr)']}
                    templateColumns={['repeat(11, 1fr)', 'repeat(11, 1fr)']}
                    gap={6}
                    mx={'auto'}
                  >
                    <GridItem w='100%' colSpan={[11, 11, 5]} align={'center'}>
                      <Box textAlign={'center'}>
                        <HStack justify={'center'} mb={10}>
                          <Box width={'50%'} position={'relative'} display={'block'}>
                            <Image src={Woman} objectFit={'cover'} width={'100%'} />
                          </Box>
                        </HStack>
                        <Fade bottom>
                          <Text fontSize={['3xl', '4xl', '3xl', '4xl']} fontWeight={'bold'} className='font-great'>Endang Syuarda. A.Md</Text>
                          {/* <Text fontSize={['md', 'lg']} fontWeight={'bold'} mt={4}>Anak Dari : </Text> */}
                          <Stack direction={['column']} gap={0}>
                            <Text fontSize={['lg', 'xl', 'xl', '2xl']} fontWeight={'bold'}>Putri dari Bapak Purn TNI AD Enjam (Alm) dan</Text>
                            {/* <Text fontSize={['xl', 'xl']} fontWeight={'bold'}>dan</Text> */}
                            <Text fontSize={['lg', 'xl', 'xl', '2xl']} fontWeight={'bold'} mt={-1}>Ibu Katimah</Text>
                          </Stack>
                        </Fade>
                      </Box>
                    </GridItem>
                    <GridItem w='100%' colSpan={[11, 11, 1]} align={'center'}>
                      <VStack justify={'center'} height={['', 'full']}>
                        <HStack width={'50%'}>
                          <Box border={'1px'} borderColor={'#8a613a'} width={'50%'}></Box>
                          <Text fontSize={['2xl', '4xl']} fontWeight={'bold'} className='font-great'>&</Text>
                          <Box border={'1px'} borderColor={'#8a613a'} width={'50%'}></Box>
                        </HStack>
                      </VStack>
                    </GridItem>
                    <GridItem w='100%' colSpan={[11, 11, 5]} align={'center'}>
                      <Box textAlign={'center'}>
                        <HStack justify={'center'} mb={6}>
                          <Box width={['50%']} position={'relative'} display={'block'}>
                            <Image src={Man} objectFit={'cover'} width={'100%'} />
                          </Box>
                        </HStack>
                        <Fade bottom>
                          <Text fontSize={['3xl', '4xl', '3xl', '4xl']} fontWeight={'bold'} className='font-great'>Muhammad Luthfi Sugara NST. S.Kom</Text>
                          {/* <Text fontSize={['md', 'lg']} fontWeight={'bold'} mt={4}>Anak Dari : </Text> */}
                          <Stack direction={['column']} gap={0}>
                            <Text fontSize={['lg', 'xl', 'xl', '2xl']} fontWeight={'bold'}>Putra dari Bapak H. Zul elmi Nasution dan </Text>
                            {/* <Text fontSize={['xl', 'xl']} fontWeight={'bold'}>dan</Text> */}
                            <Text fontSize={['lg', 'xl', 'xl', '2xl']} fontWeight={'bold'} mt={-1}>Ibu Hj. Derhinun Harahap S.Pd.I</Text>
                          </Stack>
                        </Fade>
                      </Box>
                    </GridItem>
                  </Grid>
                </HStack>
              </VStack>
            </HStack>
            <Box height={10}>
              <Wave mask="url(#mask)" fill="#d99452">
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0" stopColor="white" />
                    <stop offset="0.5" stopColor="black" />
                  </linearGradient>
                  <mask id="mask">
                    <rect x="0" y="0" width="100%" height="75%" fill="url(#gradient)"  />
                  </mask>
                </defs>
              </Wave>
            </Box>
          </Box>

          {/* Section 3 */}
          <Box
             style={{
              backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
              height: 'auto'
            }}
          >
            <HStack justify={'center'} fontWeight={'bold'}>
              <VStack height={['auto']} width={'90%'} justify={'center'} fontWeight={'bold'} textAlign={'center'} pt={12} pb={8}>
                <Box textAlign={'center'}>
                  <Text fontSize={['lg', '2xl']}>Insyaallah acara akan dilaksanan pada : </Text>
                  <Flip top>
                    <Text fontSize={['3xl', '4xl']} className='font-great' mt={10}>Akad Nikah</Text>
                  </Flip>
                  <HStack justify={'center'} mt={4}>
                    <Box gap={16}>
                      <HStack align={'center'} mb={2}>
                        <Image src={Calendar} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Sabtu, 18 November 2023</Text>
                      </HStack>
                      <HStack align={'center'}>
                        <Image src={Clock} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Pukul : 08:00 WIB - Selesai</Text>
                      </HStack>
                    </Box>
                  </HStack>
                  <Box mt={4} fontSize={['sm', 'md']} fontWeight={'bold'}>
                    <Text>Bertempat Di Masjid Al-Falah</Text>
                    <Text>Jl. Kesatria, Asrama Kodim 0204/DS Kec. Padang Hilir - Tebing Tinggi, Sumatera Utara</Text>
                  </Box>
                </Box>
                <Box mt={12}>
                  <Flip top>
                    <Text fontSize={['3xl', '4xl']} className='font-great'>Resepsi</Text>
                  </Flip>
                  <HStack justify={'center'}>
                    <Box>
                      <HStack align={'center'} mb={2}>
                        <Image src={Calendar} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Sabtu, 18 November 2023</Text>
                      </HStack>
                      <HStack align={'center'}>
                        <Image src={Clock} alt='calendar' />
                        <Text fontSize={['md', 'lg']}>Pukul : 10:00 WIB - Selesai</Text>
                      </HStack>
                    </Box>
                  </HStack>
                  <Box mt={4} fontSize={['sm', 'md']} fontWeight={'bold'}>
                    <Text>Bertempat Di Kediaman Mempelai Wanita</Text>
                    <Text fontWeight={'semibold'}>Jl. Kesatria, Asrama Kodim 0204/DS Kec. Padang Hilir (Barak Duku II ) - Tebing Tinggi, Sumatera Utara</Text>
                  </Box>
                </Box>
                <Box mt={8} width={'100%'}>
                  <LightSpeed left>
                    <HStack justify={'center'}>
                      <Box width={['100%', '505%', '60%', '40%']} border={'2px'} borderColor={'#d99452'}>
                        <iframe title='lokasi acara' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250.32691824289753!2d99.17310447498484!3d3.3322602496367257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303161e68c07ffeb%3A0x29e5274469712fcc!2sKedai%20kui%20tebing%20tinggi!5e0!3m2!1sen!2sid!4v1696303955563!5m2!1sen!2sid" width="100%" height="300" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                      </Box>
                    </HStack>
                    <Button
                      mt={4}
                      size={'sm'}
                      color={'white'}
                      background={'#d99452'}
                      _hover={{ background: '#e7af7a' }}
                      onClick={() => {
                        window.open('https://maps.app.goo.gl/ajcYDCnPwFxecL9b9')
                      }}
                    >
                      <Image src={Map} alt='map' />
                      <Text ml={2}>Lihat Lokasi</Text>
                    </Button>
                  </LightSpeed>
                </Box>
              </VStack>
            </HStack>
            <Box height={10}>
              <Wave mask="url(#mask)" fill="#d99452">
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0" stopColor="white" />
                    <stop offset="0.5" stopColor="black" />
                  </linearGradient>
                  <mask id="mask">
                    <rect x="0" y="0" width="100%" height="75%" fill="url(#gradient)"  />
                  </mask>
                </defs>
              </Wave>
            </Box>
          </Box>

          {/* Section 4 */}
          <Box
            style={{
              backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
            }}
            height={['auto']}
          >
            <HStack justify={'center'} fontWeight={'bold'}>
              <VStack height={['auto']} justify={'center'} pt={12} pb={8} px={4}>
                <Flip top>
                  <Text textAlign={'center'} fontSize={['4xl', '5xl', '6xl']} fontWeight={'bold'} className='font-great'>Wedding Gift</Text>
                </Flip>
                <Text fontSize={['md', 'lg', 'xl']} textAlign={'center'} width={['100%', '100%', '50%']} mt={8}>Tanpa mengurangi rasa hormat, jika ingin memberikan hadiah kepada kami dapat melalui : </Text>
                <HStack justify={'center'} mt={8}>
                  <Box align={'center'}>
                    <Box position={'relative'} display={'block'} width={['30%', '20%', '15%', '10%']}>
                      <Image src={BCA} alt='bni' style={{ objectFit: 'cover', width: '100%' }} />
                    </Box>
                    <Text fontSize={['sm', 'md', 'xl']} mt={4}>Transfer Ke Rekening BCA a/n</Text>
                    <Text fontSize={['lg', 'xl']} fontWeight={'bold'} mt={2}>Muhammad Luthfi Sugara Nasution</Text>
                    <Text fontSize={['md', 'lg']} fontWeight={'bold'} mt={1}>( 8205283044 )</Text>
                    <Button
                      mt={4}
                      size={['sm']}
                      color={'white'}
                      background={'#d99452'}
                      fontWeight={'bold'}
                      _hover={{ background: '#e7af7a' }}
                      onClick={() => {
                        createToast('Copied', 'success');
                        copyText('8205283044')
                      }}
                    >
                      <Image src={Copy} alt='copy' />
                      <Text ml={2}>Copy No Rekening</Text>
                    </Button>
                  </Box>
                </HStack>
                <HStack justify={'center'} mt={8}>
                  <Box align={'center'}>
                    <Box position={'relative'} display={'block'} width={['30%', '20%', '15%', '12%', '15%']}>
                      <Image src={BNI} alt='bni' style={{ objectFit: 'cover', width: '100%' }} />
                    </Box>
                    <Text fontSize={['sm', 'md', 'xl']} mt={4}>Transfer Ke Rekening BNI a/n</Text>
                    <Text fontSize={['lg', 'xl']} mt={2}>Endang Syuarda</Text>
                    <Text fontSize={['md', 'lg']} mt={1} fontWeight={'bold'}>( 0380683810 )</Text>
                    <Button
                      mt={4}
                      size={['sm']}
                      color={'white'}
                      fontWeight={'bold'}
                      background={'#d99452'}
                      _hover={{ background: '#e7af7a' }}
                      onClick={() => {
                        createToast('Copied', 'success');
                        copyText('0380683810')
                      }}
                    >
                      <Image src={Copy} alt='copy' />
                      <Text ml={2}>Copy No Rekening</Text>
                    </Button>
                  </Box>
                </HStack>
              </VStack>
            </HStack>
            <Box height={10}>
              <Wave mask="url(#mask)" fill="#d99452">
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0" stopColor="white" />
                    <stop offset="0.5" stopColor="black" />
                  </linearGradient>
                  <mask id="mask">
                    <rect x="0" y="0" width="100%" height="75%" fill="url(#gradient)"  />
                  </mask>
                </defs>
              </Wave>
            </Box>
          </Box>

          {/* Section 5 */}
          <Box
            style={{
              backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
              height: 'auto'
            }}
          >
            <HStack justify={'center'}>
              <VStack height={'auto'} width={['950%', '850%', '75%', '60%', '50%']} justify={'center'} textAlign={'center'}  pt={12} pb={8} px={4}>
                  <Text fontSize={['xl', '2xl']} fontWeight={'bold'} my={4}>Kirim pesan untuk kedua mempelai</Text>
                  <Box width={'95%'} bg={'#f3eeea'} p={4} rounded={'lg'}>
                    <Box mb={4}>
                      <Text fontSize={['sm']} textAlign={'start'} fontWeight={'semibold'}>Nama <span style={{color: 'red'}}>*</span></Text>
                      <Input 
                        name='title' 
                        value={values.name}
                        background={'white'}
                        onChange={(e) => {
                          setFieldValue('name', e.target.value);
                        }}
                      />
                      {touched.name && errors.name && (
                        <Text fontSize={"xs"} color={"red.500"} textAlign={'start'}>
                            <>{errors.name}</>
                        </Text>
                      )}
                    </Box>
                    <Box mb={4}>
                      <Text fontSize={['sm']} textAlign={'start'} fontWeight={'semibold'} mb={1}>Ucapan & doa untuk kedua mempelai <span style={{color: 'red'}}>*</span></Text>
                      <Textarea 
                        name='description' 
                        background={'white'}
                        value={values.description}
                        onChange={(e) => {
                          setFieldValue('description', e.target.value);
                        }}
                      />
                      {touched.description && errors.description && (
                        <Text fontSize={"xs"} color={"red.500"} textAlign={'start'}>
                            <>{errors.description}</>
                        </Text>
                      )}
                    </Box>
                    <HStack justify={'end'}>
                      <Button
                        color={'white'}
                        align={'end'}
                        width={'full'}
                        size={['sm']}
                        background={'#d99452'}
                        _hover={{ background: '#e7af7a' }}
                        isLoading={loadAction}
                        onClick={() => {
                          handleSubmit()
                        }}
                      >
                        Kirim Ucapan
                      </Button>
                    </HStack>
                  </Box>

                  <Box width={'95%'} height={400} overflowY={'scroll'} bg={'#f3eeea'} p={2} mt={10} rounded={'lg'}>
                    <Text casing={'uppercase'} mx={6} my={4} textAlign={'start'} fontSize={['md']} fontWeight={'bold'}>Ucapan & doa dari para undangan</Text>
                    {data &&
                    data.pages.map((page, indexPage) => (
                      <Box key={indexPage}>
                        {page.data.map((message, index) => (
                          <Box m={[2]} key={index}>
                           <Box className='arrow-up' ml={4}></Box>
                            <Box 
                              p={4}
                              mb={2} 
                              bg={'white'} 
                              rounded={'md'} 
                              width={'100%'} 
                              boxShadow={'md'}
                              textAlign={'start'}
                            >
                              <HStack justify={'space-between'}>
                                <Text color={'#d99452'} fontWeight={'bold'} mb={1} fontSize={['xs', 'sm', 'md']}>{message.name}</Text>
                                <Text 
                                  color={'#d99452'} 
                                  fontWeight={'bold'}
                                  mb={1} 
                                  fontSize={['10px', 'sm']}
                                >
                                  {formatDistanceToNow(
                                    new Date(message.created_at),
                                    {
                                      includeSeconds: true,
                                      addSuffix: true,
                                      locale: id
                                    }
                                  )}
                                </Text>
                              </HStack>
                              <Text fontWeight={'bold'} fontSize={['sm', 'md', 'lg']}>{message.description}</Text>
                            </Box>
                          </Box>
                      ))}
                      </Box>
                    ))}
                    <HStack justify={"center"} pt={2} ref={ref}>
                      {isFetching && isFetchingNextPage && (
                        <Spinner
                          size="xl"
                          speed="0.85s"
                          thickness="4px"
                          color="gicv.primary"
                          emptyColor="gray.200"
                        />
                      )}
                    </HStack>
                  </Box>
              </VStack>
            </HStack>
            <Box height={10}>
              <Wave mask="url(#mask)" fill="#d99452">
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0" stopColor="white" />
                    <stop offset="0.5" stopColor="black" />
                  </linearGradient>
                  <mask id="mask">
                    <rect x="0" y="0" width="100%" height="75%" fill="url(#gradient)"  />
                  </mask>
                </defs>
              </Wave>
            </Box>
          </Box>

          {/* Section 6 */}
          <Box
            style={{
              backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              // background: 'black',
              width: '100vw',
              height: 'auto'
            }}
          >
            <HStack justify={'center'}>
              <Box width={'95%'}>
                <Text fontWeight={'bold'} fontSize={['md', 'lg', '2xl']} textAlign={'center'} width={['95%', '95', '50%']} mx={'auto'} mt={12}>QS Ar Rum Ayat 21</Text>
                <Text fontWeight={'bold'} fontSize={['md', 'lg', 'xl']} textAlign={'center'} width={['95%', '95', '50%']} mx={'auto'} mt={4}>
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً إِنَّ فِي ذَلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
                </Text>
                <Text fontWeight={'bold'} fontSize={['md', 'lg', 'xl']} textAlign={'center'} width={['95%', '95', '50%']} mx={'auto'} mt={12}>
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”
                </Text>
                {/* <Text fontWeight={'bold'} fontSize={['md', 'lg', 'xl']} textAlign={'center'} width={['95%', '95', '50%']} mx={'auto'} mt={12}>Tiada yang dapat kami ungkapkan selain rasa terimakasih dari hati yang tulus apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan Do’a restu kepada kami</Text> */}
                <HStack justify={'center'} my={8}>
                  <Box width={['55%', '60%', '30%']} position={'relative'} display={'block'} >
                    <Image src={Scooter} objectFit={'cover'} width={'100%'} />
                  </Box>
                </HStack>
              </Box>
            </HStack>
            <Stack p={4} direction={['column', 'row']} justify={'center'} textAlign={'center'} fontWeight={'bold'} fontSize={['sm', 'lg']} borderTop={'1px'} borderColor={'#8a613a'}>
              <Text>Copyright © 2023. Luthfi & Endang</Text>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Index