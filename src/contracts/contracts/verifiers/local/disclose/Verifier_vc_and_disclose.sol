// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Verifier_vc_and_disclose {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 20491192805390485299153009773594534940189261866228447918068658471970481763042;
    uint256 constant alphay  = 9383485363053290200918347156157836566562967994039712273449902621266178545958;
    uint256 constant betax1  = 4252822878758300859123897981450591353533073413197771768651442665752259397132;
    uint256 constant betax2  = 6375614351688725206403948262868962793625744043794305715222011528459656738731;
    uint256 constant betay1  = 21847035105528745403288232691147584728191162732299865338377159692350059136679;
    uint256 constant betay2  = 10505242626370262277552901082094356697409835680220590971873171140371331206856;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 57455810572932861353831388727909088366075204808288932856874321506080883688;
    uint256 constant deltax2 = 5764520570753875100326027956117908788649085440762261220414157908759564877206;
    uint256 constant deltay1 = 8655406975943861796492431352629463226572873852124846170854394336269437918395;
    uint256 constant deltay2 = 5386971573172247270890530944665717462184382752054885261386572493916333102090;

    
    uint256 constant IC0x = 6710982312968124502110696263710671146272792381249277042399035670256510941249;
    uint256 constant IC0y = 17793180134857877241260627501204993609793276785886348584487546188400437809698;
    
    uint256 constant IC1x = 19610863069775853805612305421906767347749875362335730831522140425390703398964;
    uint256 constant IC1y = 1307513024968028873593720472299612006109034848212994694220933333600620603623;
    
    uint256 constant IC2x = 21859065864721531772332273515684435871929394319219048902592803082838839795319;
    uint256 constant IC2y = 323345326683228785410211898995362379085746101667846220805980357038604750225;
    
    uint256 constant IC3x = 7747299059164247832512411169381106520103587258763163345499551471601092753866;
    uint256 constant IC3y = 21400771921125635887276989869214688448165112675971535907311070342091049673404;
    
    uint256 constant IC4x = 9272917941328746751406014232773339388847146705363937450987582958058281137691;
    uint256 constant IC4y = 15997943243363217389307970639161802515721176080115998120911832108132438539049;
    
    uint256 constant IC5x = 15847129896485280685778087340763993160611258256845049485534932088269622558770;
    uint256 constant IC5y = 5481014080531406550248260069994619565273519629117516766134790115280551983545;
    
    uint256 constant IC6x = 21820468198218896621441410538546976351257310075253103446123149081911666335693;
    uint256 constant IC6y = 6221811032042938735512094062844623349989356330507403269453975707277238315093;
    
    uint256 constant IC7x = 13086792121126864539145260835443277140174970577231918430361690562248604014823;
    uint256 constant IC7y = 17281552960288986393815870012843751391842091678978050180802816657563326049529;
    
    uint256 constant IC8x = 19382640357114492373536791629879042023237838349661603708408247186449451598139;
    uint256 constant IC8y = 5367293928326547667311869475112238385581297059844842976432520507992337107275;
    
    uint256 constant IC9x = 18717570448885660611523743285209889040936106405923671131023056980355900699408;
    uint256 constant IC9y = 21088797123199144542782139233088999017390123045428337944574415775864050644796;
    
    uint256 constant IC10x = 16052350539502875342686411196843586605577429418973098122021586355423567175001;
    uint256 constant IC10y = 4477827646566532930759360332261901613795525430055018275633775797388041324199;
    
    uint256 constant IC11x = 19212364718153762144993742269905112210680091597373010112625268083827591011646;
    uint256 constant IC11y = 6851648950239561602591716068767318894662641520362506772186709199182336320865;
    
    uint256 constant IC12x = 10299491432497518180004453183952271067532682274867432083420560346247136663906;
    uint256 constant IC12y = 4928628247355879200347674500143030446973866885269003665344556542149783611110;
    
    uint256 constant IC13x = 11773785028599126276476363734077096931311117126731223928455082087912676796958;
    uint256 constant IC13y = 1037909783140663875960294430943604733238161904034493463148449817801984012216;
    
    uint256 constant IC14x = 19383881627954487055837087661586226382079062481334462470197917840018279107788;
    uint256 constant IC14y = 10682164703903021801873591081829525100185033880074579593718447453992416323015;
    
    uint256 constant IC15x = 15194938949573858621025512087635415621751101964745753514867716014698556468741;
    uint256 constant IC15y = 18672550995582534702229026357762932670894890364667017986583872878259195240694;
    
    uint256 constant IC16x = 15416941961812887943223952266918423289790594890755256293839128665661347356018;
    uint256 constant IC16y = 11750592981564480511148669888159472528881977325649266672570862543698640954354;
    
    uint256 constant IC17x = 1840989089044113365629239020798139151984342662489259776809675070968124577082;
    uint256 constant IC17y = 1805685832116997502517137361659511010759623291853474496705937188253597324256;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[17] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, r)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                
                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))
                
                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))
                
                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))
                
                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))
                
                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))
                
                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))
                
                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))
                
                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))
                
                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))
                
                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))
                
                g1_mulAccC(_pVk, IC13x, IC13y, calldataload(add(pubSignals, 384)))
                
                g1_mulAccC(_pVk, IC14x, IC14y, calldataload(add(pubSignals, 416)))
                
                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))
                
                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))
                
                g1_mulAccC(_pVk, IC17x, IC17y, calldataload(add(pubSignals, 512)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            
            checkField(calldataload(add(_pubSignals, 64)))
            
            checkField(calldataload(add(_pubSignals, 96)))
            
            checkField(calldataload(add(_pubSignals, 128)))
            
            checkField(calldataload(add(_pubSignals, 160)))
            
            checkField(calldataload(add(_pubSignals, 192)))
            
            checkField(calldataload(add(_pubSignals, 224)))
            
            checkField(calldataload(add(_pubSignals, 256)))
            
            checkField(calldataload(add(_pubSignals, 288)))
            
            checkField(calldataload(add(_pubSignals, 320)))
            
            checkField(calldataload(add(_pubSignals, 352)))
            
            checkField(calldataload(add(_pubSignals, 384)))
            
            checkField(calldataload(add(_pubSignals, 416)))
            
            checkField(calldataload(add(_pubSignals, 448)))
            
            checkField(calldataload(add(_pubSignals, 480)))
            
            checkField(calldataload(add(_pubSignals, 512)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
